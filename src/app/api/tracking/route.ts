export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const wayBillId = await searchParams.get('wayBillId');
    
    if (!wayBillId) {
      return Response.json({ error: 'wayBillId is required' }, { status: 400 });
    }
    
    const response = await fetch(`https://tracking.searates.com/air?number=${wayBillId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${process.env.SEARATES_API_KEY}`,
      },
    });
    
    const data = await response.json();
    return Response.json(data);
  }