type Config = {
    ENVIRONMENT: string;
    APPLICATION: string;
    STAGE: string;
    STACK_NAME: string;
}

const configProperties: (keyof Config)[] = [
    'ENVIRONMENT',
    'APPLICATION',
    'STAGE',
    'STACK_NAME',
];

const getConfig = () => {
    const config = configProperties.reduce((acc, envVarName) => {
        const envVarValue = process.env[envVarName];
        if (!envVarValue) {
            throw new Error(`required environment variable '${envVarName}' is not set`);
        }
        return { ...acc, [envVarName]: envVarValue };
    }, {}) as Config;

    return config;
}

export default getConfig;
