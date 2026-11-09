import json
import os

js_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "workflows", "finmatrix-morning-assistant-code.js"))
with open(js_path, "r", encoding="utf-8") as f:
    js_code = f.read()

workflow = {
  "name": "Finmatrix Morning Assistant & Daily Growth Briefing",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 8 * * *"
            }
          ]
        }
      },
      "id": "e1f2a3b4-5c6d-7e8f-9a0b-1c2d3e4f5a6b",
      "name": "Every Morning at 8:00 AM",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.2,
      "position": [420, 380]
    },
    {
      "parameters": {
        "jsCode": js_code
      },
      "id": "a2b3c4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d",
      "name": "Generate Finmatrix Morning Briefing",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [720, 380]
    },
    {
      "parameters": {
        "fromEmail": "\"Finmatrix Assistant\" <support@finmatrix.cloud>",
        "toEmail": "rakeshcfp@gmail.com",
        "subject": "={{ $json.briefingSubject }}",
        "html": "={{ $json.briefingHtml }}",
        "options": {}
      },
      "id": "b3c4d5e6-7f8a-9b0c-1d2e-3f4a5b6c7d8e",
      "name": "Send Morning Briefing Email",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2.1,
      "position": [1020, 380]
    }
  ],
  "pinData": {},
  "connections": {
    "Every Morning at 8:00 AM": {
      "main": [
        [
          {
            "node": "Generate Finmatrix Morning Briefing",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Finmatrix Morning Briefing": {
      "main": [
        [
          {
            "node": "Send Morning Briefing Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": True,
  "settings": {
    "executionOrder": "v1"
  }
}

target_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "workflows", "finmatrix-morning-assistant-workflow.json"))
with open(target_path, "w", encoding="utf-8") as f:
    json.dump(workflow, f, indent=2)

print(f"SUCCESS: Generated finmatrix-morning-assistant-workflow.json with clean embedded JS!")
