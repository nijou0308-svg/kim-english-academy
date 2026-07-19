export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'POST 요청만 사용할 수 있습니다.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ message: 'OPENAI_API_KEY 환경변수가 없습니다.' });
  }

  const { academyName, student, template, learning } = req.body || {};

  if (!student || !learning) {
    return res.status(400).json({ message: '보고서에 필요한 학생 정보가 없습니다.' });
  }

  const prompt = `
${academyName} 학부모님께 보낼 영어 학습보고서를 작성해 주세요.

조건:
- 대상은 고등학교 1~3학년 학생입니다.
- 말투는 따뜻하고 전문적인 학원 선생님 말투입니다.
- 과장하지 말고, 실제 관찰 내용처럼 작성합니다.
- 학부모가 바로 이해하도록 쉬운 한국어로 작성합니다.
- 마지막에는 다음 수업 목표와 가정에서 도와주실 점을 짧게 넣습니다.

보고서 양식: ${template}
학생: ${student.name}
학교: ${student.school}
학년: ${student.year}
수강반: ${student.className}

학습정보:
- 단어: ${learning.vocab}
- 리딩: ${learning.reading}
- 리스닝: ${learning.listening}
- 스피킹: ${learning.speaking}
- 선생님 코멘트: ${learning.teacherComment}
`;

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        input: prompt
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: data.error?.message || 'OpenAI API 요청에 실패했습니다.'
      });
    }

    return res.status(200).json({
      report: data.output_text || '보고서 내용을 받아오지 못했습니다.'
    });
  } catch (error) {
    return res.status(500).json({ message: '보고서 생성 중 오류가 발생했습니다.' });
  }
}
