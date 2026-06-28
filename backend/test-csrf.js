async function test() {
  try {
    // 1. Get token
    let res = await fetch('http://localhost:3000/api/auth/me');
    let cookies = res.headers.get('set-cookie');
    console.log("Cookies from GET:", cookies);
    
    let token = null;
    if (cookies) {
      const match = cookies.match(/XSRF-TOKEN=([^;]+)/);
      if (match) token = match[1];
    }
    console.log("Token:", token);

    // 2. POST without token
    console.log("\\nTesting POST without token...");
    res = await fetch('http://localhost:3000/api/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      },
      body: JSON.stringify({ name: 'Test' })
    });
    console.log("Status without token:", res.status);
    console.log(await res.text());

    // 3. POST with token
    console.log("\\nTesting POST with token...");
    res = await fetch('http://localhost:3000/api/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || '',
        'X-CSRF-Token': token || ''
      },
      body: JSON.stringify({ name: 'Test' })
    });
    console.log("Status with token:", res.status);
    // Should be 401 Unauthorized if not logged in, but not 403 Forbidden (CSRF failure)
    console.log(await res.text());
  } catch (err) {
    console.error(err);
  }
}
test();
