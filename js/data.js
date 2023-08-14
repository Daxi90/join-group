let tasks = [
    {
        "id": 0,
        "status":"todo",
        "category": {
            "name": "User Story",
            "backgroundColor": "#ff0000"
        },
        "title": "Task 1",
        "description": "Beschreibung für Task 1",
        "completionDate": "2023-08-15",
        "priority": "high",
        "assignedPersons": [
            "1",
            "2"
        ],
        "subtasks": [
            {
                "id": 0.1,
                "title": "Subtask 1.1",
                "completed": false
            },
            {
                "id": 0.2,
                "title": "Subtask 1.2",
                "completed": true
            }
        ]
    },
    {
        "id": 1,
        "status":"todo",
        "category": {
            "name": "User Story",
            "backgroundColor": "#0ff0f0"
        },
        "title": "Task 2",
        "description": "Beschreibung für Task 2",
        "completionDate": "2023-08-20",
        "priority": "medium",
        "assignedPersons": [
            "3",
            "1"
        ],
        "subtasks": [
            {
                "id": 1.1,
                "title": "Subtask 2.1",
                "completed": false
            }
        ]
    },
    {
        "id": 2,
        "status":"inprogress",
        "category": {
            "name": "User Story",
            "backgroundColor": "#0ff0f0"
        },
        "title": "Task 2",
        "description": "Beschreibung für Task 3",
        "completionDate": "2023-08-20",
        "priority": "low",
        "assignedPersons": [
            "2",
            "1"
        ],
        "subtasks": [
            {
                "id": 2.1,
                "title": "Subtask 2.1",
                "completed": true
            }
        ]
    }
]