// Action used to modify store data
export const usernameAction = (username) => (
	{
		type: 'UPDATE-USERNAME',
		payload: username
	}
)

export const userIDAction = (userID) => (
	{
		type: 'UPDATE-USERID',
		payload: userID
	}
)

export const originAction = (origin) => (
	{
		type: 'UPDATE-ORIGIN',
		payload: origin
	}
)