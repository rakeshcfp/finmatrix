import json

with open('workflows/finmatrix-lead-capture-workflow.json', 'r', encoding='utf-8') as f:
    wf = json.load(f)

# 1. Clean CRM Columns node definition
clean_node = {
  "parameters": {
    "jsCode": r'''// Only pass the 10 CRM columns to Google Sheets (ignore email HTML and internal vars):
const item = $input.first().json;
return [{
  json: {
    "Timestamp": item.Timestamp,
    "Name": item.Name,
    "Email": item.Email,
    "Phone": item.Phone,
    "Toolkit": item.Toolkit,
    "Affiliate_Category": item.Affiliate_Category,
    "Recommended_Product": item.Recommended_Product,
    "Affiliate_Offer_URL": item.Affiliate_Offer_URL,
    "Source_Page": item.Source_Page,
    "Lead_Quality": item.Lead_Quality
  }
}];'''
  },
  "id": "c1d2e3f4-a5b6-7890-1234-9876543210ab",
  "name": "Clean CRM Columns",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [1380, 420]
}

# Remove if already exists, then add
wf['nodes'] = [n for n in wf['nodes'] if n['name'] != 'Clean CRM Columns']
wf['nodes'].append(clean_node)

# Adjust position of Save Lead node
for n in wf['nodes']:
    if 'Save Lead' in n['name']:
        n['position'] = [1620, 420]
        n['parameters']['columns'] = {
            "mappingMode": "autoMapInputData",
            "value": {},
            "matchingColumns": []
        }

# Rewire connections:
# Filter Duplicate Tool Downloads -> Clean CRM Columns -> Save Lead & Segment
# Filter Duplicate Tool Downloads -> Email 1
wf['connections']['Filter Duplicate Tool Downloads'] = {
  "main": [
    [
      { "node": "Clean CRM Columns", "type": "main", "index": 0 },
      { "node": "Email 1: Immediate Toolkit Delivery", "type": "main", "index": 0 }
    ]
  ]
}

wf['connections']['Clean CRM Columns'] = {
  "main": [
    [
      { "node": "Save Lead & Segment to Google Sheets CRM", "type": "main", "index": 0 }
    ]
  ]
}

with open('workflows/finmatrix-lead-capture-workflow.json', 'w', encoding='utf-8') as f:
    json.dump(wf, f, indent=2)

print("SUCCESS: Clean CRM Columns node added and wired!")

