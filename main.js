
const url = "https://jsonplaceholder.typicode.com/todos";

// AXIOS GLOBALS	

axios.defaults.headers.common['X-Auth-Token'] = 'sometoken';

// GET REQUEST
function getTodos() {
	axios.get(`${url}?_limit=10`,{timeout: 1100})
		.then((res) => showOutput(res))
		.catch((err) => console.log(err));
}

// POST REQUEST
function addTodo() {
	axios
		.post(url, {
			title: "New Todo",
			completed: false,
		})
		.then((res) => showOutput(res))
		.catch((err) => console.log(err));
}

// PUT/PATCH REQUEST
function updateTodo() {
	axios
		.patch(url + '/1', {
			title: "Updated Todo",
			completed: true,
		})
		.then((res) => showOutput(res))
		.catch((err) => console.log(err));
}

// DELETE REQUEST
function removeTodo() {
	axios.delete(url + '/1')
		.then((res) => showOutput(res))
		.catch(err => console.log(err))
}

// SIMULTANEOUS DATA
function getData() {
	axios.all([
		axios.get('https://jsonplaceholder.typicode.com/todos'),
		axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
	])
		.then(axios.spread((todos,posts) => {
			console.log(todos)
			console.log(posts)
			showOutput(posts)
		}))
		.catch(err => console.log(err))
}

// CUSTOM HEADERS
function customHeaders() {
	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'some token'
		}
	}
	axios
		.post(url, {
			title: "New Todo",
			completed: false,
		},config)
		.then((res) => showOutput(res))
		.catch((err) => console.log(err));

}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
	const options = {
		method: 'post',
		url,
		data: {
			title: 'Hello World'
		},
		transformResponse: axios.defaults.transformResponse.concat((data) => {
			data.title = data.title.toUpperCase()
			return data;
		})
	}

	axios(options)
		.then((res) => showOutput(res))
		.catch((err) => console.log(err));
}

// ERROR HANDLING
function errorHandling() {
	axios.get(url + 'ss', {
		validateStatus: function(status) {
			return status < 500 // Reject only if status is greater or equal to 500
		}
	})
		.then(res => showOutput(res))
		.catch(err => {
			if(err.response) {		
				//Server responded with a status other than 200 range
				console.log(err.response.data)
				console.log(err.response.status)
				console.log(err.response.headers)
				if(err.response.status === 404) {
					alert("Error: Page Not Found")
				}
			} else if(err.request) {
				//Request was made but no response
				console.log(err.request);
			} else {
				console.log(err.message)
			}
		})
}

// CANCEL TOKEN
function cancelToken() {
	const source = axios.CancelToken.source();
	console.log(source)
	axios.get(url, {
		cancelToken: source.token
	})
		.then(res => showOutput(res))
		.catch(thrown => {
			console.log(thrown)
			if(axios.isCancel(thrown)) {
				console.log('Request canceled',thrown.message)
			}
		})

	if(true) {
		source.cancel('Request canceled !');
	}
}

// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use(config => {
	console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().toString()}`)
	return config;
},error => {
	return Promise.reject(error)
})

// AXIOS INSTANCES
const axiosInstance = axios.create({
	//Other custom setting
	baseURL: 'https://jsonplaceholder.typicode.com'
})

axiosInstance.get('/comments').then(res => showOutput(res))

// Show output in browser
function showOutput(res) {
	document.getElementById("res").innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById("get").addEventListener("click", getTodos);
document.getElementById("post").addEventListener("click", addTodo);
document.getElementById("update").addEventListener("click", updateTodo);
document.getElementById("delete").addEventListener("click", removeTodo);
document.getElementById("sim").addEventListener("click", getData);
document.getElementById("headers").addEventListener("click", customHeaders);
document
	.getElementById("transform")
	.addEventListener("click", transformResponse);
document.getElementById("error").addEventListener("click", errorHandling);
document.getElementById("cancel").addEventListener("click", cancelToken);
