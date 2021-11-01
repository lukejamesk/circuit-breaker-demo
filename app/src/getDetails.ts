const getSecondServiceRequest = async (forceFail: boolean) => new Promise((resolve, reject) => {
  console.log('2nd service request processing');
  if (!forceFail) {
    resolve({ data: 'Success '});
  } else { 
    reject({ data: 'Failed' });
  }
});

const getDetails = async (forceFail: boolean) => new Promise(async (resolve, reject) => {
  try {
    console.log('1st service request processing');
    const result = await getSecondServiceRequest(forceFail);
    
    resolve(result);
  } catch (err) {
    reject(err)
  }
});

export default getDetails;
