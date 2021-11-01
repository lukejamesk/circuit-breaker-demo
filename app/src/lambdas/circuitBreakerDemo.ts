import getDetails from "../getDetails";
import getCircuitBreaker from "./circuitBreaker";

type Event = {
    forceFail?: boolean;
};

export default async (event: Event) => {
    console.log(event)
    const { forceFail = false } = event;
    const circuitBreaker = getCircuitBreaker({
        failureThreshold: 5,
        timeout: 10000,
        successThreshold: 2,
    });

    const result = await circuitBreaker(() => getDetails(forceFail));

    const response = {
        statusCode: 200,
        body: JSON.stringify(result)
    };

    console.log(response);
}