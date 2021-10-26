const getSecondServiceRequest = async () => new Promise((resolve, reject) => {
  console.log('2nd service request processing');
  if (Math.random() < 0.6) {
    resolve({ data: 'Success '});
  } else { 
    reject({ data: 'Failed' });
  }
});

const getDetails = async () => new Promise(async (resolve, reject) => {
  try {
    console.log('1st service request processing');
    const result = await getSecondServiceRequest();
    resolve(result);
  } catch (err) {
    reject(err)
  }
});

export default getDetails;
