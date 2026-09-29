class AppConfig {
    public readonly BaseServerUrl = import.meta.env.VITE_BASE_SERVER_URL;
    public readonly vacationsUrl = `${this.BaseServerUrl}/vacations`;
    public readonly loginUrl = `${this.BaseServerUrl}/auth/sign-in`;
    public readonly registerUrl = `${this.BaseServerUrl}/auth/sign-up`;
    public readonly recommendationsUrl = `${this.BaseServerUrl}/ai/recommendations`;

    public readonly mcpUrl = `${this.BaseServerUrl}/mcp/ask`;

    public readonly recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    public readonly openaiUrl = "https://api.openai.com/v1/responses";
}

export const appConfig = new AppConfig();