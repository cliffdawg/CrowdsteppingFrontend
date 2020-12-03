// When using a proxy, cannot use root endpoint '/' for route, will return HTML
//const APIURL = '/api';
const APIURL = 'https://lit-caverns-29354.herokuapp.com/https://webdevproject1.herokuapp.com';

const throwError = async (resp) => {
    const unknownErr = { errorMessage: 'Unknown error' };
    try {
        const body = await resp.json();
        if (body.message !== undefined) {
            let err = { errorMessage: body.message };
            throw err;
        } else {
            throw unknownErr;
        }
    } catch (e) {
        throw unknownErr;
    }
};

const verifyToken = async (token) => {
    //APIURL,
    console.log(`verify token: ${token}`);
    const resp = await fetch(APIURL + '/token', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        })
    });
    if (!resp.ok) {
        throwError(resp);
    } else {
        return resp.json();
    }
}

const signIn = async (credentials) => {
    console.log(`credentials: ${credentials.username}, API:`);
    const resp = await fetch(APIURL + '/signin', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(credentials)
    });
    console.log(`response: ${resp}`);
    if (!resp.ok) {
        throwError(resp);
    } else {
        return resp.json();
    }
};

const signUp = async (post, token) => {
    // username
    // email
    // password
    console.log(`post: ${post}`);
    const resp = await fetch(APIURL + '/signUp', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(post)
    });
    if (!resp.ok) {
        throwError(resp);
    } else {
        return resp.json();
    }
};

const getGoals = async (token) => {
    //APIURL,
    console.log(`getGoals: ${token}`)
    const resp = await fetch(APIURL + '/goals', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        })
    });
    if (!resp.ok) {
        throwError(resp);
    } else {
        return resp.json();
    }
}; 

const createGoal = async (post, token) => {
    console.log(`post: ${post}`);
    //APIURL,
    const resp = await fetch(APIURL + '/goal', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }),
        body: JSON.stringify(post)
    });
    if (!resp.ok) {
        throwError(resp);
    } else {
        return resp.json();
    }
};

const getSteps = async (goal, token) => {
    //APIURL,
    console.log(`getSteps: ${token}`)
    const resp = await fetch(APIURL + '/steps', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }),
        body: JSON.stringify(goal)
    });
    if (!resp.ok) {
        throwError(resp);
    } else {
        return resp.json();
    }
}; 

const getVotes = async (userGoal, token) => {
    //APIURL,
    console.log(`getVotes: ${token}`)
    const resp = await fetch(APIURL + '/votes', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }),
        body: JSON.stringify(userGoal)
    });
    if (!resp.ok) {
        throwError(resp);
    } else {
        return resp.json();
    }
}; 

const createStep = async (prospectiveStep, token) => {
    //APIURL,
    console.log(`create step: ${prospectiveStep.goal}, ${prospectiveStep.step}`);
    const resp = await fetch(APIURL + '/step', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }),
        body: JSON.stringify(prospectiveStep)
    });
    if (!resp.ok) {
        throwError(resp);
    } else {
        return resp.json();
    }
}; 

const patchStep = async (specificStep, token) => {
    //APIURL,
    console.log(`patch step: ${specificStep.userID}, ${specificStep.goal}, ${specificStep.step}, ${specificStep.endorsed}`);
    const resp = await fetch(APIURL + '/step', {
        method: 'PATCH',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }),
        body: JSON.stringify(specificStep)
    });
    if (!resp.ok) {
        throwError(resp);
    } else {
        return resp.json();
    }
}; 

const negateStep = async (specificStep, token) => {
    //APIURL,
    console.log(`negateStep: ${specificStep.userID}, ${specificStep.goal}, ${specificStep.step}, ${specificStep.endorsed}`);
    const resp = await fetch(APIURL + '/negateStep', {
        method: 'PATCH',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }),
        body: JSON.stringify(specificStep)
    });
    if (!resp.ok) {
        throwError(resp);
    } else {
        return resp.json();
    }
}; 

const switchStep = async (specificStep, token) => {
    //APIURL,
    console.log(`switchStep: ${specificStep.userID}, ${specificStep.goal}, ${specificStep.step}, ${specificStep.endorsed}`);
    const resp = await fetch(APIURL + '/switchStep', {
        method: 'PATCH',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }),
        body: JSON.stringify(specificStep)
    });
    if (!resp.ok) {
        throwError(resp);
    } else {
        return resp.json();
    }
}; 

const getNumber = async () => {
    //APIURL,
    const resp = await fetch(APIURL + '/');
    if (!resp.ok) {
        console.log('api getNumber fail');
        throwError(resp);
    } else {
        console.log('api getNumber okay', resp);
        return resp.json();
    }
};

export {
    verifyToken,
    signIn,
    signUp,
    getGoals,
    createGoal,
    getSteps,
    getVotes,
    createStep,
    patchStep,
    negateStep,
    switchStep,
    getNumber
};