import requests
import json

url = "http://127.0.0.1:5000/api/data"
REMOVE_KEYS = {"jd",  "sql_id", "summary"}

def shrink_field_keep_first(value):
    try:
        parsed = json.loads(value)
        if isinstance(parsed, list) and len(parsed) > 0:
            return json.dumps([parsed[0]] + [["demo"] for _ in parsed[1:]])
        return json.dumps([["demo"]])
    except Exception:
        return json.dumps([["demo"]])


def clean_data(obj):
    if isinstance(obj, dict):
        return {
            k: clean_data(v)
            for k, v in obj.items()
            if k not in REMOVE_KEYS
        }
    if isinstance(obj, list):
        return [clean_data(i) for i in obj]
    return obj

def is_empty_mach_skills(value):
    try:
        parsed = json.loads(value)

        # must be list with at least one element
        if not isinstance(parsed, list) or not parsed:
            return True

        first = parsed[0]

        # must be [skills, score]
        if not isinstance(first, list) or len(first) == 0:
            return True

        # skills must not be empty list
        if isinstance(first[0], list) and len(first[0]) == 0:
            return True

        return False

    except Exception:
        return True

try:
    response = requests.get(url)
    response.raise_for_status()

    raw = response.json()
    cleaned = clean_data(raw)

    key = "response" if "response" in cleaned else "responce"
    data_list = cleaned.get(key, [])

    email_count = 0
    resume_count = 0
    limited_data = []

    for d in data_list:
        
        if is_empty_mach_skills(d.get("mach_skills")) or d.get("creation_type") =="test":
            continue 
        if "filed" in d:
            d["filed"] = shrink_field_keep_first(d["filed"])

        if "skills" in d:
            d["skills"] = shrink_field_keep_first(d["skills"])

        if "mach_skills" in d:
            d["mach_skills"] = shrink_field_keep_first(d["mach_skills"])

        if d.get("send_to_email"):
            if email_count >= 20:
                continue
            d["send_to_email"] = "xyz@xdoman.com"
            email_count += 1
        else:
            if resume_count >= 20:
                continue
            resume_count += 1

        limited_data.append(d)

    cleaned[key] = limited_data

    with open("SkillSnap/dbs/data.json", "w", encoding="utf-8") as f:
        json.dump(cleaned, f, indent=4, ensure_ascii=False)

    print("✅ Saved limited cleaned data.json")

except requests.exceptions.RequestException:
    print("❌ API request failed")

except ValueError:
    print("❌ Response not valid JSON")
    
    
    