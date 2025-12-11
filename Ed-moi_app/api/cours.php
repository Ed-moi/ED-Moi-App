<?php
// api/cours.php - Gestion des cours

require_once 'config.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getCourseById($db, $_GET['id']);
        } elseif (isset($_GET['category_id'])) {
            getCoursesByCategory($db, $_GET['category_id']);
        } else {
            getAllCourses($db);
        }
        break;
    
    case 'POST':
        createCourse($db, $data);
        break;
    
    default:
        sendResponse(['error' => true, 'message' => 'Méthode non autorisée'], 405);
}

function getAllCourses($db) {
    $query = "SELECT c.*, cat.category_name, u.username as creator_name
              FROM cours c
              LEFT JOIN categories cat ON c.category_id = cat.category_id
              LEFT JOIN users u ON c.created_by = u.user_id
              WHERE c.status = 'approuve'
              ORDER BY c.creation_date DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    sendResponse([
        'error' => false,
        'count' => count($courses),
        'courses' => $courses
    ], 200);
}

function getCourseById($db, $id) {
    $query = "SELECT c.*, cat.category_name, u.username as creator_name
              FROM cours c
              LEFT JOIN categories cat ON c.category_id = cat.category_id
              LEFT JOIN users u ON c.created_by = u.user_id
              WHERE c.cours_id = :id AND c.status = 'approuve'
              LIMIT 1";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $course = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Récupérer le contenu du cours
        $contentQuery = "SELECT * FROM cours_content 
                        WHERE cours_id = :id 
                        ORDER BY `order` ASC";
        $contentStmt = $db->prepare($contentQuery);
        $contentStmt->bindParam(':id', $id);
        $contentStmt->execute();
        
        $course['content'] = $contentStmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Récupérer les commentaires
        $commentsQuery = "SELECT cc.*, u.username 
                         FROM cours_comments cc
                         LEFT JOIN users u ON cc.user_id = u.user_id
                         WHERE cc.course_id = :id
                         ORDER BY cc.creation_date DESC
                         LIMIT 10";
        $commentsStmt = $db->prepare($commentsQuery);
        $commentsStmt->bindParam(':id', $id);
        $commentsStmt->execute();
        
        $course['comments'] = $commentsStmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendResponse([
            'error' => false,
            'course' => $course
        ], 200);
    } else {
        sendResponse([
            'error' => true,
            'message' => 'Cours introuvable'
        ], 404);
    }
}

function getCoursesByCategory($db, $categoryId) {
    $query = "SELECT c.*, cat.category_name, u.username as creator_name
              FROM cours c
              LEFT JOIN categories cat ON c.category_id = cat.category_id
              LEFT JOIN users u ON c.created_by = u.user_id
              WHERE c.category_id = :category_id AND c.status = 'approuve'
              ORDER BY c.creation_date DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':category_id', $categoryId);
    $stmt->execute();
    
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    sendResponse([
        'error' => false,
        'count' => count($courses),
        'courses' => $courses
    ], 200);
}

function createCourse($db, $data) {
    $missing = validateRequired($data, ['title', 'description', 'category_id', 'created_by']);
    if (!empty($missing)) {
        sendResponse([
            'error' => true,
            'message' => 'Champs manquants: ' . implode(', ', $missing)
        ], 400);
    }

    $title = sanitize($data['title']);
    $description = sanitize($data['description']);
    $category_id = intval($data['category_id']);
    $created_by = intval($data['created_by']);
    $level = isset($data['level']) ? sanitize($data['level']) : 'debutant';

    $query = "INSERT INTO cours (title, description, category_id, created_by, level, status) 
              VALUES (:title, :description, :category_id, :created_by, :level, 'en_attente')";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':category_id', $category_id);
    $stmt->bindParam(':created_by', $created_by);
    $stmt->bindParam(':level', $level);

    if ($stmt->execute()) {
        $courseId = $db->lastInsertId();
        
        sendResponse([
            'error' => false,
            'message' => 'Cours créé avec succès',
            'course_id' => $courseId
        ], 201);
    } else {
        sendResponse([
            'error' => true,
            'message' => 'Erreur lors de la création du cours'
        ], 500);
    }
}
?>