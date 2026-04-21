CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'STUDENT', 'VERIFIER', 'FACULTY') NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS missions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category_tier VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    goal VARCHAR(1000) NOT NULL,
    duration VARCHAR(60) NOT NULL,
    sdg_tag VARCHAR(30) NOT NULL,
    points INT NOT NULL,
    evidence_requirements VARCHAR(1000) NOT NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_missions_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_missions_feed_filters (department, category_tier, sdg_tag, is_active)
);

CREATE TABLE IF NOT EXISTS submissions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mission_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    file_hash CHAR(64) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(120) NOT NULL,
    text_summary VARCHAR(1000) NOT NULL,
    event_code VARCHAR(50) NULL,
    status ENUM('PENDING') NOT NULL DEFAULT 'PENDING',
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_submissions_mission FOREIGN KEY (mission_id) REFERENCES missions(id),
    CONSTRAINT fk_submissions_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT uq_submissions_file_hash UNIQUE KEY (file_hash),
    INDEX idx_submissions_student_id (student_id),
    INDEX idx_submissions_status_submitted_at (status, submitted_at)
);
