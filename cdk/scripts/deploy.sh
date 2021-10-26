SERVICE_NAME=${ENVIRONMENT:-dev}
ENVIRONMENT=${ENVIRONMENT:-dev}
APPLICATION=${APPLICATION:-"cdk-base"}
STACK_NAME=${STAGE}-${ENVIRONMENT}-${APPLICATION}

cdk deploy \
    --tags Environment=${ENVIRONMENT} \
    --tags Deployment=${ENVIRONMENT} \
    --tags StackName=${STACK_NAME} \
    --tags BusinessFunction=product \
    --tags Application=shared-services \
    --tags Service=${SERVICE_NAME} \
    --tags Module=data-access-layer \
    --tags Name=${SERVICE_NAME} \
    --tags "Ownership=${OWNERSHIP}" \
    --require-approval never
