// This utils is used to convert data from smc
class ConvertUtils {
  static SupportedTypes = {
    "0x1::string::String": "string",
    address: "block_address",
    u8: "unsigned int 8 bits",
    u64: "unsigned int 64 bits",
  };

  // Convert ASCII byte array to string
  bytesToString(bytes) {
    const filteredBytes = bytes.filter((b) => b >= 32 && b <= 126);
    // For example: from 49 (ASCII) to 1 (Decimal)
    return String.fromCharCode(...filteredBytes);
  }

  // Convert byte array to hex address
  bytesToHexAddress(bytes) {
    // Convert ASCII Byte to Hexadecimal
    // And ensure that string with 1 value will have `0`
    // Before it, for example, 5 -> 05; a -> 0a
    return "0x" + bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Convert byte array to 64-bit unsigned integer
  bytesToU64(bytes) {
    const buffer = Buffer.from(bytes);
    return buffer.readBigUInt64LE();
  }

  convert(bytes, type) {
    switch (type) {
      case ConvertUtils.SupportedTypes["0x1::string::String"]:
        return bytesToString(bytes);
      case ConvertUtils.SupportedTypes["address"]:
        return bytesToHexAddress(bytes);
      case ConvertUtils.SupportedTypes["u8"]:
        return bytes[0];
      case ConvertUtils.SupportedTypes["u64"]:
        return Number(bytesToU64(bytes)); // Convert BigInt to Number if needed
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }

  /**
   * Convert an array of bytes object to readable string.
   * Bytes object contains bytes and type (target type of conversion)
   * @param arrayBytesObject
   */
  convertMultiply(bytesObjects) {
    const that = this;
    return bytesObjects.map((bytesObject) =>
      that.convert(bytesObject[0], bytesObject[1])
    );
  }
}

module.exports = ConvertUtils;
