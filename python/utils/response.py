class Response:
  def __init__(self):
    pass

  def getStdDict(self, message = "Response", has_error = 0, data = {}):
    data = {
      "message": message,
      "error": has_error,
      "data": data
    }

    return data