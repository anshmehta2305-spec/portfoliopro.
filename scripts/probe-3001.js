async function test() {
  try {
    const res = await fetch('http://localhost:3001/');
    console.log('Status 3001:', res.status);
    const html = await res.text();
    const cssMatches = html.match(/href="([^"]+\.css[^"]*)"/g);
    console.log('CSS Links in HTML:', cssMatches);
    if (cssMatches) {
      for (const m of cssMatches) {
        const href = m.match(/href="([^"]+)"/)[1];
        const cssUrl = href.startsWith('http') ? href : 'http://localhost:3001' + href;
        const cssRes = await fetch(cssUrl);
        console.log('CSS URL:', cssUrl, 'Status:', cssRes.status, 'Content-Type:', cssRes.headers.get('content-type'));
        const cssText = await cssRes.text();
        console.log('CSS Preview:', cssText.slice(0, 150));
      }
    } else {
      console.log('NO CSS LINKS FOUND IN HTML!');
      console.log('HTML Head preview:', html.slice(0, 1000));
    }
  } catch (e) {
    console.error('Fetch error:', e);
  }
}
test();

