use crate::{appstate::AppState, errors::AtomicServerResult, helpers::get_client_agent};
use actix_files::NamedFile;
use actix_web::{web, HttpRequest, HttpResponse};
use atomic_lib::{urls, Resource, Storelike};

use serde::Deserialize;
use std::{collections::HashSet, path::PathBuf};

#[serde_with::serde_as]
#[serde_with::skip_serializing_none]
#[derive(Deserialize, Debug)]
pub struct DownloadParams {
    pub q: Option<f32>,
    pub w: Option<u32>,
    pub f: Option<String>,
}

/// Downloads the File of the Resource that matches the same URL minus the `/download` path.
#[tracing::instrument(skip(appstate, req))]
pub async fn handle_download(
    path: Option<web::Path<String>>,
    appstate: web::Data<AppState>,
    params: web::Query<DownloadParams>,
    req: actix_web::HttpRequest,
) -> AtomicServerResult<HttpResponse> {
    let headers = req.headers();
    let server_url = &appstate.config.server_url;
    let store = &appstate.store;

    // We replace `/download` with `/` to get the subject of the Resource.
    let subject = if let Some(pth) = path {
        let subject = format!("{}/{}", server_url, pth);
        subject
    } else {
        // There is no end string, so It's the root of the URL, the base URL!
        return Err("Put `/download` in front of an File URL to download it.".into());
    };

    let for_agent = get_client_agent(headers, &appstate, subject.clone())?;
    tracing::info!("handle_download: {}", subject);
    let resource = store.get_resource_extended(&subject, false, &for_agent)?;
    download_file_handler_partial(&resource, &req, &params, &appstate)
}

pub fn download_file_handler_partial(
    resource: &Resource,
    req: &HttpRequest,
    params: &web::Query<DownloadParams>,
    appstate: &AppState,
) -> AtomicServerResult<HttpResponse> {
    let filename = resource
        .get(urls::INTERNAL_ID)
        .map_err(|e| format!("Internal ID of file could not be resolved. {}", e))?
        .to_string();
    let mut file_path = appstate.config.uploads_path.clone();
    file_path.push(&filename);

    // No params were given, so we just return the file.
    if params.q.is_none() && params.w.is_none() && params.f.is_none() {
        let file = NamedFile::open(file_path)?;
        return Ok(file.into_response(req));
    }

    create_processed_folder_if_not_exists(&appstate.config.uploads_path)?;
    let processed_file_path =
        build_prossesed_file_path(&filename, params, appstate.config.uploads_path.clone())?;

    if processed_file_path.exists() {
        let file = NamedFile::open(processed_file_path)?;
        return Ok(file.into_response(req));
    }

    // only if image feature flag is on
    #[cfg(feature = "image")]
    {
        use crate::handlers::image::{is_image, process_image};
        if !is_image(&file_path) {
            return Err("Quality or with parameter are not supported for non image files".into());
        }
        let format = get_format(params)?;
        process_image(&file_path, &processed_file_path, params, &format)?;
    }

    let file = NamedFile::open(processed_file_path)?;
    Ok(file.into_response(req))
}

pub fn build_prossesed_file_path(
    filename: &str,
    params: &DownloadParams,
    base_path: PathBuf,
) -> AtomicServerResult<PathBuf> {
    let format = get_format(params)?;

    let Some((timestamp, rest)) = filename.split_once('-') else {
        return Err("Filename does not contain a timestamp.".into());
    };

    let mut new_filename = String::new();

    new_filename.push_str(timestamp);

    if let Some(quality) = &params.q {
        new_filename.push_str(&format!("-q{}", quality));
    }
    if let Some(width) = &params.w {
        new_filename.push_str(&format!("-w{}", width));
    }

    new_filename.push_str(&format!("-{}", rest));
    let mut processed_file_path = base_path.join("processed").join(new_filename);
    processed_file_path.set_extension(format);

    Ok(processed_file_path)
}

fn create_processed_folder_if_not_exists(base_path: &PathBuf) -> AtomicServerResult<()> {
    let mut processed_folder = base_path.clone();
    processed_folder.push("processed");
    std::fs::create_dir_all(processed_folder)?;
    Ok(())
}

fn get_format(params: &DownloadParams) -> AtomicServerResult<String> {
    let supported_compression_formats: HashSet<String> =
        HashSet::from_iter(vec!["webp".to_string(), "avif".to_string()]);

    let format = params.f.clone().unwrap_or("webp".to_string());
    if !supported_compression_formats.contains(&format) {
        return Err("Unsupported format".into());
    }

    Ok(format)
}
