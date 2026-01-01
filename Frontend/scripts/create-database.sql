-- Creating MySQL database schema for Clinical NLP system
CREATE DATABASE IF NOT EXISTS clinical_nlp_db;
USE clinical_nlp_db;

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(36) PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  file_path VARCHAR(500),
  file_size INT,
  mime_type VARCHAR(100),
  status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL
);

-- Entities table
CREATE TABLE IF NOT EXISTS entities (
  id VARCHAR(36) PRIMARY KEY,
  document_id VARCHAR(36) NOT NULL,
  text VARCHAR(500) NOT NULL,
  type ENUM('disease', 'symptom', 'medication', 'lab_value', 'procedure') NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  start_pos INT NOT NULL,
  end_pos INT NOT NULL,
  icd_code VARCHAR(20),
  rxnorm_code VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  INDEX idx_document_id (document_id),
  INDEX idx_type (type)
);

-- Processing logs table
CREATE TABLE IF NOT EXISTS processing_logs (
  id VARCHAR(36) PRIMARY KEY,
  document_id VARCHAR(36),
  status ENUM('started', 'processing', 'completed', 'failed') NOT NULL,
  message TEXT,
  progress INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  INDEX idx_document_id (document_id),
  INDEX idx_created_at (created_at)
);

-- EHR connections table
CREATE TABLE IF NOT EXISTS ehr_connections (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('epic', 'cerner', 'allscripts', 'athenahealth') NOT NULL,
  status ENUM('connected', 'disconnected', 'error') DEFAULT 'disconnected',
  fhir_endpoint VARCHAR(500),
  last_sync TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default EHR connections
INSERT INTO ehr_connections (id, name, type, status, fhir_endpoint, last_sync) VALUES
('ehr-1', 'Epic MyChart Integration', 'epic', 'connected', 'https://fhir.epic.com/interconnect-fhir-oauth', NOW()),
('ehr-2', 'Cerner PowerChart', 'cerner', 'connected', 'https://fhir-ehr.cerner.com/r4', DATE_SUB(NOW(), INTERVAL 1 HOUR))
ON DUPLICATE KEY UPDATE name=VALUES(name);
