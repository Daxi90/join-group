// ACHTUNG!! Bei den Subtasks aufpassen, dass diese immer eine einyigartige ID haben, ansonsten werden diese nicht gefunden
// Am Besten so wie in den Demodaten beschrieben, die ID vom Haupttask + fortlaufende Nummer Beispiel: 1.2 für Haupttask 1 und Subtask 2

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
        "assignedPersons": [1],
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
            },
            {
                "id": 0.3,
                "title": "Subtask 1.3",
                "completed": true
            },
            {
                "id": 0.4,
                "title": "Subtask 1.4",
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
        "assignedPersons": [1,0],
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
        "title": "Task 3",
        "description": "Beschreibung für Task 3",
        "completionDate": "2023-08-20",
        "priority": "low",
        "assignedPersons": [1,0],
        "subtasks": [
            {
                "id": 2.1,
                "title": "Subtask 2.1",
                "completed": true
            }
        ]
    }
]

let contacts = [
    {
        'name': 'testn testl',
        'email': 'teste',
        'phone': 'testp',
        'initials': 'TT',
        'color': 'blue',
        'id': 0
    },
    {
        'name': 'testn testl',
        'email': 'teste',
        'phone': 'testp',
        'initials': 'DH',
        'color': 'red',
        'id': 1
    },
];