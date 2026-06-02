import json

log_file = "/Users/usuario/.gemini/antigravity-ide/brain/2bcd1a7d-9b47-4030-ae04-531b6d06daea/.system_generated/logs/transcript.jsonl"
target_file = "/Users/usuario/Desktop/Kupper/Dev/test 2 web osmo/src/animations/lusionAnimations.js"

with open(log_file, "r") as f:
    for line in f:
        try:
            data = json.loads(line)
            # Check for replace_file_content or multi_replace_file_content tools
            if "tool_calls" in data:
                for tc in data["tool_calls"]:
                    args = tc.get("Arguments")
                    if isinstance(args, str):
                        try:
                            args = json.loads(args)
                        except:
                            pass
                    if isinstance(args, dict):
                        tf = args.get("TargetFile")
                        if tf and target_file in tf:
                            print(f"Step {data.get('step_index')}: {tc.get('Name')} / {tc.get('ToolName')}")
                            print("Instruction:", args.get("Instruction"))
                            print("Description:", args.get("Description"))
                            if "ReplacementContent" in args:
                                print("ReplacementContent snippet:\n", args["ReplacementContent"][:200])
                            elif "ReplacementChunks" in args:
                                for chunk in args["ReplacementChunks"]:
                                    print("Chunk ReplacementContent snippet:\n", chunk.get("ReplacementContent")[:200])
                            print("="*60)
            elif data.get("type") in ("WRITE_TO_FILE", "REPLACE_FILE_CONTENT", "MULTI_REPLACE_FILE_CONTENT", "CODE_ACTION"):
                # Check content for target_file references
                content = data.get("content", "")
                if target_file in content:
                    print(f"Step {data.get('step_index')}: {data.get('type')}")
                    print(content[:500])
                    print("="*60)
        except Exception as e:
            pass
