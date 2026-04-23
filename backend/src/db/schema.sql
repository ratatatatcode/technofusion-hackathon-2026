CREATE DATABASE IF NOT EXISTS hackathon;
USE hackathon;


/* ===== Auth ===== */
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



/* ===== Main Dashboard ===== */
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
    created_by INT NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_missions_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_missions_feed_filters (department, category_tier, sdg_tag, is_active)
);

CREATE TABLE IF NOT EXISTS submissions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mission_id BIGINT UNSIGNED NOT NULL,
    student_id INT NOT NULL,
    file_hash CHAR(64) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(120) NOT NULL,
    text_summary VARCHAR(1000) NOT NULL,
    event_code VARCHAR(50) NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',  -- Updated status
    verified_by INT NULL,
    verified_at TIMESTAMP NULL,
    reject_reason VARCHAR(1000) NULL,
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_submissions_mission FOREIGN KEY (mission_id) REFERENCES missions(id),
    CONSTRAINT fk_submissions_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_submissions_verifier FOREIGN KEY (verified_by) REFERENCES users(id),
    CONSTRAINT uq_submissions_file_hash UNIQUE KEY (file_hash),
    
    INDEX idx_submissions_student_id (student_id),
    INDEX idx_submissions_status_submitted_at (status, submitted_at)
)



/* ===== Points + Leaderboard ===== */
CREATE TABLE IF NOT EXISTS student_points (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    name VARCHAR(100), 
    department VARCHAR(100),
    season VARCHAR(30) NOT NULL DEFAULT '2025-S1',
    total_pts INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_sp_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_season (student_id, season)
)

CREATE TABLE IF NOT EXISTS badges (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  badge_type VARCHAR(60) NOT NULL,
  awarded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_badges_student FOREIGN KEY (student_id) REFERENCES users(id),
  UNIQUE KEY uq_student_badge (student_id, badge_type)
);


/* ===== Problem Board ===== */
CREATE TABLE IF NOT EXISTS problems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_problems_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS problem_quests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    problem_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(20) NOT NULL DEFAULT '1 week',
    points INT DEFAULT 10,
    is_active TINYINT(1) DEFAULT 1,
    CONSTRAINT fk_quests_problem FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
);