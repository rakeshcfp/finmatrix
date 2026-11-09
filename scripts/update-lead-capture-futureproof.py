import json
import os

wf_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "workflows", "finmatrix-lead-capture-workflow.json"))
js_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "workflows", "finmatrix-lead-processor-futureproof.js"))

with open(wf_path, "r", encoding="utf-8") as f:
    wf = json.load(f)

with open(js_path, "r", encoding="utf-8") as f:
    js_code = f.read()

for n in wf["nodes"]:
    if n["name"] == "Match Contextual Affiliate Product":
        n["parameters"]["jsCode"] = js_code
        print("Updated Match Contextual Affiliate Product node with future-proof engine!")

with open(wf_path, "w", encoding="utf-8") as f:
    json.dump(wf, f, indent=2)

print("Saved updated finmatrix-lead-capture-workflow.json successfully!")

