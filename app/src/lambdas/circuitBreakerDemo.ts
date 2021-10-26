import getDetails from "../getDetails";
import getCircuitBreaker from "./circuitBreaker";

export default async () => {
    const circuitBreaker = getCircuitBreaker({
        failureThreshold: 5,
        timeout: 10000,
        successThreshold: 2,
    });

    const result = await circuitBreaker(getDetails);

    const response = {
        statusCode: 200,
        body: JSON.stringify(result)
    };

    console.log(response);
}