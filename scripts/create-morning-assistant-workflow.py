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
      "id": "6fd2c876-349d-4dda-9cfa-98eaa34f1e2d",
      "name": "Every Morning at 8:00 AM",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.2,
      "position": [
        880,
        208
      ]
    },
    {
      "parameters": {
        "jsCode": js_code
      },
      "id": "b2187473-83a4-4113-801f-42b2e0ef9cc0",
      "name": "Generate Finmatrix Morning Briefing",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1184,
        208
      ]
    },
    {
      "parameters": {
        "fromEmail": "\"Finmatrix Assistant\" <support@finmatrix.cloud>",
        "toEmail": "rakeshcfp@gmail.com",
        "subject": "={{ $json.briefingSubject }}",
        "html": "={{ $json.briefingHtml }}",
        "options": {}
      },
      "id": "3cc40dac-c7b7-44c1-b482-5eab0e9799f6",
      "name": "Send Morning Briefing Email",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2.1,
      "position": [
        1488,
        208
      ],
      "webhookId": "fb91d32a-d9f4-45f1-9e14-4f1a98900da0",
      "credentials": {
        "smtp": {
          "id": "8PcGewmN8tSE4r3w",
          "name": "SMTP account"
        }
      }
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
    "executionOrder": "v1",
    "binaryMode": "separate",
    "availableInMCP": False
  },
  "versionId": "a542ca9b-9602-44d1-8b93-93cfc599d8d6",
  "meta": {
    "templateCredsSetupCompleted": True,
    "instanceId": "96fbe9d9c6a77ca502b83dd37d9d3b4920bc2fba5c65cc3700027ca5d1cae302"
  },
  "nodeGroups": [],
  "id": "rVaRJWMGUaBeutcd",
  "tags": []
}

target_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "workflows", "finmatrix-morning-assistant-workflow.json"))
with open(target_path, "w", encoding="utf-8") as f:
    json.dump(workflow, f, indent=2)

print("SUCCESS: Updated finmatrix-morning-assistant-workflow.json with automated CI/CD instructions and user credentials!")
