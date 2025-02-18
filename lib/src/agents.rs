//! Logic for Agents
//! Agents are actors (such as users) that can edit content.
//! https://docs.atomicdata.dev/commits/concepts.html

use base64::{engine::general_purpose, Engine};
use serde_json::from_slice;

use crate::{errors::AtomicResult, urls, Resource, Storelike, Value};

/// None represents no right checks will be performed, effectively SUDO mode.
#[derive(Clone, Debug, PartialEq)]
pub enum ForAgent {
    /// The Subject URL agent that is performing the action.
    AgentSubject(String),
    /// Allows all checks to pass.
    /// See [urls::SUDO_AGENT]
    Sudo,
    /// Public Agent, most strict.
    /// See [urls::PUBLIC_AGENT]
    Public,
}

impl std::fmt::Display for ForAgent {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ForAgent::AgentSubject(subject) => write!(f, "{}", subject),
            ForAgent::Sudo => write!(f, "{}", urls::SUDO_AGENT),
            ForAgent::Public => write!(f, "{}", urls::PUBLIC_AGENT),
        }
    }
}

// From all string-likes
impl<T: Into<String>> From<T> for ForAgent {
    fn from(subject: T) -> Self {
        let subject = subject.into();
        if subject == urls::SUDO_AGENT {
            ForAgent::Sudo
        } else if subject == urls::PUBLIC_AGENT {
            ForAgent::Public
        } else {
            ForAgent::AgentSubject(subject)
        }
    }
}

/// An Agent can be thought of as a User. Agents are used for authentication and authorization.
/// The private key of the Agent is used to sign [crate::Commit]s.
#[derive(Clone, Debug)]
pub struct Agent {
    /// Private key for signing commits
    pub private_key: Option<String>,
    /// Used for validating commit signatures and for the username.
    pub public_key: String,
    /// URL of the Agent
    pub subject: String,
    pub created_at: i64,
    pub name: Option<String>,
}

impl Agent {
    /// Converts Agent to Resource.
    /// Does not include private key, only public.
    pub fn to_resource(&self) -> AtomicResult<Resource> {
        let mut resource = Resource::new(self.subject.clone());
        resource.set_class(urls::AGENT);
        resource.set_subject(self.subject.clone());
        if let Some(name) = &self.name {
            resource.set_unsafe(crate::urls::NAME.into(), Value::String(name.into()));
        }
        resource.set_unsafe(
            crate::urls::PUBLIC_KEY.into(),
            Value::String(self.public_key.clone()),
        );
        // Agents must be read by anyone when validating their keys
        resource.push(crate::urls::READ, urls::PUBLIC_AGENT.into(), true)?;
        resource.set_unsafe(
            crate::urls::CREATED_AT.into(),
            Value::Timestamp(self.created_at),
        );
        Ok(resource)
    }

    /// Creates a new Agent, generates a new Keypair.
    pub fn new(name: Option<&str>, store: &impl Storelike) -> AtomicResult<Agent> {
        let keypair = generate_keypair()?;

        Agent::new_from_private_key(name, store, &keypair.private)
    }

    /// Creates a new Agent on this server, using the server's Server URL.
    /// Derives the public key.
    pub fn new_from_private_key(
        name: Option<&str>,
        store: &impl Storelike,
        private_key: &str,
    ) -> AtomicResult<Agent> {
        let keypair = generate_public_key(private_key);

        Ok(Agent {
            private_key: Some(keypair.private),
            public_key: keypair.public.clone(),
            subject: format!("{}/agents/{}", store.get_server_url()?, keypair.public),
            name: name.map(|x| x.to_owned()),
            created_at: crate::utils::now(),
        })
    }

    /// Creates a new Agent on this server, using the server's Server URL.
    /// This will not be able to write, because there is no private key.
    pub fn new_from_public_key(store: &impl Storelike, public_key: &str) -> AtomicResult<Agent> {
        verify_public_key(public_key)?;

        Ok(Agent {
            private_key: None,
            public_key: public_key.into(),
            subject: format!("{}/agents/{}", store.get_server_url()?, public_key),
            name: None,
            created_at: crate::utils::now(),
        })
    }

    pub fn from_secret(secret_b64: &str) -> AtomicResult<Agent> {
        let agent_bytes = decode_base64(secret_b64)?;
        let parsed: serde_json::Value = from_slice(&agent_bytes)?;
        let private_key = parsed["privateKey"].as_str().ok_or("Invalid private key")?;
        let subject = parsed["subject"].as_str().ok_or("Invalid subject")?;
        let agent = Agent {
            private_key: Some(private_key.into()),
            public_key: generate_public_key(private_key).public,
            subject: subject.into(),
            name: None,
            created_at: crate::utils::now(),
        };
        Ok(agent)
    }

    pub fn from_private_key_and_subject(private_key: &str, subject: &str) -> AtomicResult<Agent> {
        let keypair = generate_public_key(private_key);

        Ok(Agent {
            private_key: Some(keypair.private),
            public_key: keypair.public.clone(),
            subject: subject.into(),
            name: None,
            created_at: crate::utils::now(),
        })
    }
}

/// keypair, serialized using base64
pub struct Pair {
    pub private: String,
    pub public: String,
}

/// Returns a new random keypair.
fn generate_keypair() -> AtomicResult<Pair> {
    use ring::signature::KeyPair;
    let rng = ring::rand::SystemRandom::new();
    const SEED_LEN: usize = 32;
    let seed: [u8; SEED_LEN] = ring::rand::generate(&rng)
        .map_err(|e| format!("Error generating random seed: {}", e))?
        .expose();
    let key_pair = ring::signature::Ed25519KeyPair::from_seed_unchecked(&seed)
        .map_err(|e| format!("Error generating keypair: {}", e))
        .unwrap();
    Ok(Pair {
        private: encode_base64(&seed),
        public: encode_base64(key_pair.public_key().as_ref()),
    })
}

/// Returns a Key Pair (including public key) from a private key, base64 encoded.
pub fn generate_public_key(private_key: &str) -> Pair {
    use ring::signature::KeyPair;
    let private_key_bytes = decode_base64(private_key).unwrap();
    let key_pair = ring::signature::Ed25519KeyPair::from_seed_unchecked(private_key_bytes.as_ref())
        .map_err(|e| format!("Error generating keypair: {e}"))
        .unwrap();
    Pair {
        private: encode_base64(&private_key_bytes),
        public: encode_base64(key_pair.public_key().as_ref()),
    }
}

pub fn decode_base64(string: &str) -> AtomicResult<Vec<u8>> {
    let vec = general_purpose::STANDARD
        .decode(string)
        .map_err(|e| format!("Invalid key. Not valid Base64. {}", e))?;
    Ok(vec)
}

pub fn encode_base64(bytes: &[u8]) -> String {
    general_purpose::STANDARD.encode(bytes)
}

/// Checks if the public key is a valid ED25519 base64 key.
/// Not perfect - only checks byte length and parses base64.
pub fn verify_public_key(public_key: &str) -> AtomicResult<()> {
    let pubkey_bin = decode_base64(public_key)
        .map_err(|e| format!("Invalid public key. Not valid Base64. {}", e))?;
    if pubkey_bin.len() != 32 {
        return Err(format!(
            "Invalid public key, should be 32 bytes long instead of {}. Key: {}",
            pubkey_bin.len(),
            public_key
        )
        .into());
    }
    Ok(())
}

impl From<Agent> for ForAgent {
    fn from(agent: Agent) -> Self {
        agent.subject.into()
    }
}

impl<'a> From<&'a Agent> for ForAgent {
    fn from(agent: &'a Agent) -> Self {
        let subject: String = agent.subject.clone();
        subject.into()
    }
}

#[cfg(test)]
mod test {
    #[cfg(test)]
    use super::*;

    #[test]
    fn keypair() {
        let pair = generate_keypair().unwrap();
        let regenerated_pair = generate_public_key(&pair.private);
        assert_eq!(pair.public, regenerated_pair.public);
    }

    #[test]
    fn generate_from_private_key() {
        let private_key = "CapMWIhFUT+w7ANv9oCPqrHrwZpkP2JhzF9JnyT6WcI=";
        let public_key = "7LsjMW5gOfDdJzK/atgjQ1t20J/rw8MjVg6xwqm+h8U=";
        let regenerated_pair = generate_public_key(private_key);
        assert_eq!(public_key, regenerated_pair.public);
    }

    #[test]
    fn verifies_public_keys() {
        let valid_public_key = "7LsjMW5gOfDdJzK/atgjQ1t20J/rw8MjVg6xwqm+h8U=";
        let invalid_length = "7LsjMW5gOfDdJzK/atgjQ1t20J/rw8MjVg6xwm+h8U";
        let invalid_char = "7LsjMW5gOfDdJzK/atgjQ1t20^/rw8MjVg6xwqm+h8U=";
        verify_public_key(valid_public_key).unwrap();
        verify_public_key(invalid_length).unwrap_err();
        verify_public_key(invalid_char).unwrap_err();
    }

    #[test]
    fn creates_from_secret() {
        let secret = "eyJjbGllbnQiOnt9LCJzdWJqZWN0IjoiaHR0cDovL2xvY2FsaG9zdDo5ODgzL2FnZW50cy9ScVB3cGdIditQSzdQbnovZFZhYjhobUhqWW52VEwxWXJsVmE2TDlHOVpnPSIsInByaXZhdGVLZXkiOiJTTXl4UmdGN1FoaUM3QzUwNnFYU1VLZkUrU0tBdENkTkZ1NVhlVGp6YWRBPSIsInB1YmxpY0tleSI6IlJxUHdwZ0h2K1BLN1Buei9kVmFiOGhtSGpZbnZUTDFZcmxWYTZMOUc5Wmc9In0=";
        let agent = Agent::from_secret(secret).unwrap();
        assert_eq!(
            agent.private_key.unwrap(),
            "SMyxRgF7QhiC7C506qXSUKfE+SKAtCdNFu5XeTjzadA="
        );
        assert_eq!(
            agent.subject,
            "http://localhost:9883/agents/RqPwpgHv+PK7Pnz/dVab8hmHjYnvTL1YrlVa6L9G9Zg="
        );
    }
}
