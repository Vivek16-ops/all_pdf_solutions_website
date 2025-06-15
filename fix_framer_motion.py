#!/usr/bin/env python3
"""
Script to fix Framer Motion spring animation errors by adding type: "tween" 
to transitions that use 3+ keyframe arrays like scale: [1, 1.2, 1]
"""

import os
import re
import glob

def fix_spring_animations(file_path):
    """Fix spring animations in a single file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Pattern 1: Find animate props with 3+ keyframe arrays
    # Looking for patterns like: animate={{ scale: [1, 1.2, 1] }}
    animate_pattern = r'animate=\{\{\s*([^}]+)\s*\}\}'
    
    def fix_animate_block(match):
        animate_content = match.group(1)
        
        # Check if this animate block has 3+ keyframe arrays
        keyframe_patterns = [
            r'scale:\s*\[[^\]]*,\s*[^\]]*,\s*[^\]]*[^\]]*\]',
            r'y:\s*\[[^\]]*,\s*[^\]]*,\s*[^\]]*[^\]]*\]',
            r'x:\s*\[[^\]]*,\s*[^\]]*,\s*[^\]]*[^\]]*\]',
            r'rotate:\s*\[[^\]]*,\s*[^\]]*,\s*[^\]]*[^\]]*\]',
            r'opacity:\s*\[[^\]]*,\s*[^\]]*,\s*[^\]]*[^\]]*\]'
        ]
        
        has_multi_keyframes = any(re.search(pattern, animate_content) for pattern in keyframe_patterns)
        
        if has_multi_keyframes:
            # Look ahead to find the transition prop
            return match.group(0) + "___NEEDS_TWEEN_FIX___"
        
        return match.group(0)
    
    content = re.sub(animate_pattern, fix_animate_block, content, flags=re.DOTALL)
    
    # Pattern 2: Fix transition blocks that come after marked animate blocks
    def fix_transition_after_animate(match_obj):
        full_match = match_obj.group(0)
        
        if "___NEEDS_TWEEN_FIX___" in full_match:
            # Remove the marker
            full_match = full_match.replace("___NEEDS_TWEEN_FIX___", "")
            
            # Look for transition prop
            transition_pattern = r'transition=\{\{\s*([^}]+)\s*\}\}'
            
            def add_tween_type(trans_match):
                trans_content = trans_match.group(1)
                
                # Check if type is already specified
                if re.search(r'\btype\s*:', trans_content):
                    return trans_match.group(0)
                
                # Add type: "tween" to the transition
                if trans_content.strip().endswith(','):
                    new_content = f"{trans_content} type: \"tween\""
                else:
                    new_content = f"{trans_content}, type: \"tween\""
                
                return f"transition={{{{{new_content}}}}}"
            
            # Try to find and fix transition in the same component
            lines = full_match.split('\n')
            for i, line in enumerate(lines):
                if 'transition=' in line:
                    lines[i] = re.sub(transition_pattern, add_tween_type, line)
                    break
            
            return '\n'.join(lines)
        
        return full_match
    
    # Look for component blocks that might contain both animate and transition
    component_pattern = r'<motion\.[^>]*>.*?</motion\.[^>]*>|<motion\.[^>]*/>|<motion\.div[^>]*(?:>[\s\S]*?</motion\.div>|\s*/>)'
    content = re.sub(component_pattern, fix_transition_after_animate, content, flags=re.DOTALL)
    
    # Pattern 3: Direct pattern matching for common cases
    patterns_to_fix = [
        # animate={{ scale: [1, 1.2, 1] }} followed by transition={{ duration: X, repeat: Y }}
        (
            r'animate=\{\{\s*scale:\s*\[1,\s*1\.2,\s*1\]\s*\}\}[\s\n]*transition=\{\{\s*([^}]+)\s*\}\}',
            lambda m: f'animate={{{{ scale: [1, 1.2, 1] }}}}\\ntransition={{{{ {m.group(1)}, type: "tween" }}}}'
        ),
        # animate={{ scale: [1, 1.2, 1], ... }} followed by transition={{ ... }}
        (
            r'animate=\{\{\s*([^}]*scale:\s*\[1,\s*1\.2,\s*1\][^}]*)\s*\}\}[\s\n]*transition=\{\{\s*([^}]+)\s*\}\}',
            lambda m: f'animate={{{{ {m.group(1)} }}}}\\ntransition={{{{ {m.group(2)}, type: "tween" }}}}'
        ),
    ]
    
    for pattern, replacement in patterns_to_fix:
        if isinstance(replacement, str):
            content = re.sub(pattern, replacement, content, flags=re.MULTILINE | re.DOTALL)
        else:
            content = re.sub(pattern, replacement, content, flags=re.MULTILINE | re.DOTALL)
    
    # Clean up any remaining markers
    content = content.replace("___NEEDS_TWEEN_FIX___", "")
    
    # Simple direct replacements for common problematic patterns
    simple_fixes = [
        (
            'transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}',
            'transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, type: "tween" }}'
        ),
        (
            'transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}',
            'transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, type: "tween" }}'
        ),
        (
            'transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}',
            'transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, type: "tween" }}'
        ),
        (
            'transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}',
            'transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4, type: "tween" }}'
        ),
        (
            'transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}',
            'transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, type: "tween" }}'
        ),
        (
            'transition={{ duration: 2, repeat: Infinity }}',
            'transition={{ duration: 2, repeat: Infinity, type: "tween" }}'
        ),
        (
            'transition={{ duration: 1, repeat: Infinity }}',
            'transition={{ duration: 1, repeat: Infinity, type: "tween" }}'
        ),
    ]
    
    for old, new in simple_fixes:
        content = content.replace(old, new)
    
    # Write back if changed
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    """Main function to fix all TypeScript/TSX files"""
    base_dir = "."
    
    # Find all TSX files
    tsx_files = []
    for pattern in ["**/*.tsx", "**/*.ts"]:
        tsx_files.extend(glob.glob(os.path.join(base_dir, pattern), recursive=True))
    
    # Exclude node_modules and .next directories
    tsx_files = [f for f in tsx_files if 'node_modules' not in f and '.next' not in f]
    
    print(f"Found {len(tsx_files)} TypeScript/TSX files to check")
    
    fixed_files = []
    
    for file_path in tsx_files:
        try:
            if fix_spring_animations(file_path):
                fixed_files.append(file_path)
                print(f"✅ Fixed: {file_path}")
            else:
                print(f"⏭️  No changes needed: {file_path}")
        except Exception as e:
            print(f"❌ Error processing {file_path}: {e}")
    
    print(f"\n🎉 Fixed {len(fixed_files)} files total!")
    
    if fixed_files:
        print("\nFixed files:")
        for file_path in fixed_files:
            print(f"  - {file_path}")

if __name__ == "__main__":
    main()
