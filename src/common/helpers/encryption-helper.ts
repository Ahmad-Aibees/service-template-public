import * as crypto from 'crypto';

export class EncryptionHelper {
    private static enc_algorithm = 'aes-256-cbc';
    private static enc_key = Buffer.from('8l4VcgZ7b2pysZznW025123kjhUIOHGF', 'utf8');
    private static enc_iv = Buffer.from('-y/B?D(R+R;lQeTh', 'utf8');

    public static initialize(algorithm: string, key: string, iv: string): void {
        EncryptionHelper.enc_algorithm = algorithm;
        EncryptionHelper.enc_key = Buffer.from(key, 'utf8');
        EncryptionHelper.enc_iv = Buffer.from(iv, 'utf8');
    }

    public static encrypt(text): string {
        const cipher = crypto.createCipheriv(this.enc_algorithm, Buffer.from(this.enc_key), this.enc_iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('hex');
    }

    public static decrypt(text): string {
        const encryptedText = Buffer.from(text, 'hex');
        const decipher = crypto.createDecipheriv(this.enc_algorithm, Buffer.from(this.enc_key), this.enc_iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
