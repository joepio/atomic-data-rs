use actix_web::{error::ResponseError, http::StatusCode, HttpResponse};
use atomic_lib::{parse::JSON_AD_MIME, urls, Resource, Value};
use serde::Serialize;
use std::error::Error;

// More strict Result type
pub type AtomicServerResult<T> = std::result::Result<T, AtomicServerError>;

#[derive(Debug)]
pub enum AppErrorType {
    NotFound,
    Unauthorized,
    Other,
}

// More strict error type, supports HTTP responses
// Needs a lot of work, though
#[derive(Debug)]
pub struct AtomicServerError {
    pub message: String,
    pub error_type: AppErrorType,
    /// If the error comes from Atomic-Lib, it can contain its own properties + values set in a Resource.
    pub error_resource: Option<Resource>,
}

impl AtomicServerError {}

#[derive(Serialize)]
pub struct AppErrorResponse {
    pub error: String,
}

impl Error for AtomicServerError {}

impl ResponseError for AtomicServerError {
    fn status_code(&self) -> StatusCode {
        match self.error_type {
            AppErrorType::NotFound => StatusCode::NOT_FOUND,
            AppErrorType::Other => StatusCode::INTERNAL_SERVER_ERROR,
            AppErrorType::Unauthorized => StatusCode::UNAUTHORIZED,
        }
    }
    fn error_response(&self) -> HttpResponse {
        // Creates a JSON-AD resource representing the Error.
        let r = match &self.error_resource {
            Some(r) => r.to_owned(),
            None => {
                let mut r = Resource::new("subject".into());
                r.set_class(urls::ERROR);
                r.set_propval_unsafe(
                    urls::DESCRIPTION.into(),
                    Value::String(self.message.clone()),
                );
                r
            }
        };

        let body = r.to_json_ad().unwrap();
        tracing::info!("Error response");
        HttpResponse::build(self.status_code())
            .content_type(JSON_AD_MIME)
            .body(body)
    }
}

impl std::fmt::Display for AtomicServerError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", &self.message)
    }
}

// Error conversions

// This is probably the most common and most important type of error
impl From<atomic_lib::errors::AtomicError> for AtomicServerError {
    fn from(error: atomic_lib::errors::AtomicError) -> Self {
        let error_type = match error.error_type {
            atomic_lib::errors::AtomicErrorType::NotFoundError => AppErrorType::NotFound,
            atomic_lib::errors::AtomicErrorType::UnauthorizedError => AppErrorType::Unauthorized,
            _ => AppErrorType::Other,
        };
        AtomicServerError {
            message: error.to_string(),
            error_type,
            error_resource: Some(error.into_resource("subject".into())),
        }
    }
}

impl From<&str> for AtomicServerError {
    fn from(message: &str) -> Self {
        AtomicServerError {
            message: message.into(),
            error_type: AppErrorType::Other,
            error_resource: None,
        }
    }
}

impl From<String> for AtomicServerError {
    fn from(message: String) -> Self {
        AtomicServerError {
            message,
            error_type: AppErrorType::Other,
            error_resource: None,
        }
    }
}

impl From<std::boxed::Box<dyn std::error::Error>> for AtomicServerError {
    fn from(error: std::boxed::Box<dyn std::error::Error>) -> Self {
        AtomicServerError {
            message: error.to_string(),
            error_type: AppErrorType::Other,
            error_resource: None,
        }
    }
}

impl<T> From<std::sync::PoisonError<T>> for AtomicServerError {
    fn from(error: std::sync::PoisonError<T>) -> Self {
        AtomicServerError {
            message: error.to_string(),
            error_type: AppErrorType::Other,
            error_resource: None,
        }
    }
}

impl From<std::io::Error> for AtomicServerError {
    fn from(error: std::io::Error) -> Self {
        AtomicServerError {
            message: error.to_string(),
            error_type: AppErrorType::Other,
            error_resource: None,
        }
    }
}

impl From<tantivy::directory::error::OpenDirectoryError> for AtomicServerError {
    fn from(error: tantivy::directory::error::OpenDirectoryError) -> Self {
        AtomicServerError {
            message: error.to_string(),
            error_type: AppErrorType::Other,
            error_resource: None,
        }
    }
}

impl From<tantivy::TantivyError> for AtomicServerError {
    fn from(error: tantivy::TantivyError) -> Self {
        AtomicServerError {
            message: error.to_string(),
            error_type: AppErrorType::Other,
            error_resource: None,
        }
    }
}

#[cfg(feature = "https")]
impl From<acme_lib::Error> for AtomicServerError {
    fn from(error: acme_lib::Error) -> Self {
        AtomicServerError {
            message: error.to_string(),
            error_type: AppErrorType::Other,
            error_resource: None,
        }
    }
}

impl From<actix_web::Error> for AtomicServerError {
    fn from(error: actix_web::Error) -> Self {
        AtomicServerError {
            message: error.to_string(),
            error_type: AppErrorType::Other,
            error_resource: None,
        }
    }
}
