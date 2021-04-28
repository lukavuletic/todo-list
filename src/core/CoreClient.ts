const url = 'http://localhost:4000/api';

class CoreClient {
    post: (query: string) => Promise<any> = (query: string) => {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'mode': 'no-cors',
                'url': `http://localhost:4000`,
            },
            body: JSON.stringify({ query })
        });
    }
}

export default CoreClient;