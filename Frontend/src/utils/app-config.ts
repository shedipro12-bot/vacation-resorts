class AppConfig {
    public readonly BaseServerUrl = import.meta.env.VITE_BASE_SERVER_URL;
    public readonly vacationsUrl = `${this.BaseServerUrl}/vacations`;
    public readonly loginUrl = `${this.BaseServerUrl}/auth/login`;
    public readonly registerUrl = `${this.BaseServerUrl}/auth/register`;

    
    public readonly recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    public readonly openaiUrl = "https://api.openai.com/v1/responses";
}

export const appConfig = new AppConfig();