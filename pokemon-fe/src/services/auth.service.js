import axios from "axios";
import { generateNonceUrl, verifySignatureUrl } from "../utils/network";

export class AuthUserApi {
  static async generateNonce(address) {
    const response = await axios.post(generateNonceUrl, { address });
    return response.data;
  }

  static async verifySignature(address, signature) {
    const response = await axios.post(verifySignatureUrl, {
      address,
      signature,
    });
    return response.data;
  }
}
