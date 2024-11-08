def is_array(arg) -> bool:
    return isinstance(arg, (list, tuple))

def is_string(s) -> bool:
    if not isinstance(s, str) or not s.strip():
        return False
    return True