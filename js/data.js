let tasks = [
    {
        "id": 1,
        "category": {
            "name": "Kategorie 1",
            "backgroundColor": "#ff0000"
        },
        "title": "Task 1",
        "description": "Beschreibung für Task 1",
        "completionDate": "2023-08-15",
        "priority": "Hoch",
        "assignedPersons": [
            "1",
            "2"
        ],
        "subtasks": [
            {
                "id": 1.1,
                "title": "Subtask 1.1",
                "completed": false
            },
            {
                "id": 1.2,
                "title": "Subtask 1.2",
                "completed": true
            }
        ]
    },
    {
        "id": 2,
        "category": {
            "name": "Kategorie 2",
            "backgroundColor": "#0ff0f0"
        },
        "title": "Task 2",
        "description": "Beschreibung für Task 2",
        "completionDate": "2023-08-20",
        "priority": "Mittel",
        "assignedPersons": [
            "3"
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