/**
 * SpeakLog 정적 데이터
 * ─────────────────────────────────────────────
 * 후기·공지·상담 신청은 Supabase(api.js)에서 조회·저장합니다.
 * 이 파일은 사이트 정적 콘텐츠(수강료, FAQ 등)만 담습니다.
 */
const SpeakLogData = {
  site: {
    name: "SpeakLog",
    tagline: "1:1 온라인 영어회화",
    url: "https://speaklog.co.kr",
    phone: "010-5647-2912",
    phoneDisplay: "010-5647-2912",
    kakaoUrl: "http://pf.kakao.com/_NxhqPX/friend",
    instagramUrl: "https://www.instagram.com/speaklog_official?igsh=MW5pdDVkdWYwNG93Mw%3D%3D&utm_source=qr",
    businessHours: "평일 09:00 – 21:00 · 토요일 10:00 – 17:00",
  },

  /** 학습 목표(상담 신청) / 수강 유형(후기) 공통 옵션 */
  learnerTypes: [
    { value: "work", label: "직장인 회화" },
    { value: "elementary", label: "초등학생" },
    { value: "middle", label: "중학생" },
    { value: "high", label: "고등학생" },
    { value: "student", label: "대학생 / 취업 준비" },
    { value: "travel", label: "여행 영어" },
    { value: "beginner", label: "영어회화 초보" },
    { value: "other", label: "기타" },
  ],

  /** @type {PricingPlan[]} */
  pricing: [
    {
      id: "plan-2x",
      frequency: "주 2회",
      sessionsPerWeek: 2,
      price: 89000,
      priceLabel: "89,000원",
      period: "월",
      badge: null,
      featured: false,
      description: "부담 없이 꾸준히 시작하기 좋은 플랜",
    },
    {
      id: "plan-3x",
      frequency: "주 3회",
      sessionsPerWeek: 3,
      price: 119000,
      priceLabel: "119,000원",
      period: "월",
      badge: "인기",
      featured: true,
      description: "가장 많이 선택하는 균형 잡힌 플랜",
    },
    {
      id: "plan-5x",
      frequency: "주 5회",
      sessionsPerWeek: 5,
      price: 189000,
      priceLabel: "189,000원",
      period: "월",
      badge: "집중",
      featured: false,
      description: "빠른 실력 향상을 원하는 분께 추천",
    },
  ],

  pricingEvent: {
    active: true,
    label: "오픈 이벤트",
    description: "지금 상담 신청 시 첫 달 특별 혜택을 드립니다",
  },

  /** @type {FaqItem[]} */
  faq: [
    {
      id: "faq-1",
      question: "수업은 어떻게 진행되나요?",
      answer:
        "Zoom 등 화상 프로그램으로 1:1 실시간 수업이 진행됩니다. 강사와 자유롭게 대화하며 발음·표현·문법을 바로 교정받을 수 있고, 수업 후 학습 자료도 제공됩니다.",
    },
    {
      id: "faq-2",
      question: "예약 변경 가능한가요?",
      answer:
        "네, 가능합니다. 수업 24시간 전까지 예약 변경·취소가 가능하며, 급한 일정 변경은 카카오톡으로 문의해 주시면 최대한 맞춰 드립니다.",
    },
    {
      id: "faq-3",
      question: "아이도 수강 가능한가요?",
      answer:
        "네, 유치원생부터 수강 가능합니다. 아이의 레벨과 성향에 맞는 강사를 매칭해 재미있고 편안한 분위기에서 수업을 진행합니다.",
    },
    {
      id: "faq-4",
      question: "레벨 테스트는 무료인가요?",
      answer:
        "네, 상담과 함께 무료 레벨 테스트를 진행합니다. 듣기·말하기 실력을 확인한 뒤 맞춤 학습 플랜을 제안해 드립니다.",
    },
    {
      id: "faq-5",
      question: "필리핀 강사는 발음이 괜찮은가요?",
      answer:
        "SpeakLog 강사는 모두 엄격한 채용 기준을 통과한 검증된 강사입니다. 명확한 발음과 풍부한 회화 경험으로 자연스러운 영어 표현을 익힐 수 있습니다.",
    },
  ],

  features: [
    {
      id: "feature-1",
      icon: "shield-check",
      title: "검증된 필리핀 영어 강사",
      description: "엄격한 채용·교육 과정을 거친 전문 강사만 매칭합니다",
      color: "navy",
    },
    {
      id: "feature-2",
      icon: "user",
      title: "1:1 맞춤 수업",
      description: "레벨과 목표에 맞춘 개인별 커리큘럼으로 효율적으로 학습합니다",
      color: "pink",
    },
    {
      id: "feature-3",
      icon: "calendar",
      title: "원하는 시간 예약",
      description: "직장인·학생 일정에 맞게 자유롭게 수업 시간을 선택하세요",
      color: "orange",
    },
    {
      id: "feature-4",
      icon: "video",
      title: "온라인 수업",
      description: "집·카페 어디서든 Zoom으로 편하게 1:1 화상 수업을 받으세요",
      color: "sky",
    },
  ],

  audiences: [
    { id: "audience-1", icon: "briefcase", label: "직장인", color: "navy" },
    { id: "audience-2", icon: "book-open", label: "학생", color: "sky" },
    { id: "audience-3", icon: "graduation", label: "대학생", color: "purple" },
    { id: "audience-4", icon: "target", label: "취업 준비생", color: "pink" },
    { id: "audience-5", icon: "plane", label: "여행 영어", color: "orange" },
    { id: "audience-6", icon: "seedling", label: "영어회화 초보", color: "teal" },
  ],

  process: [
    { id: "step-1", step: 1, title: "상담", description: "학습 목표와 일정을 함께 상담합니다" },
    { id: "step-2", step: 2, title: "레벨 테스트", description: "무료 테스트로 현재 실력을 확인합니다" },
    { id: "step-3", step: 3, title: "강사 매칭", description: "성향·레벨에 맞는 강사를 배정합니다" },
    { id: "step-4", step: 4, title: "수업 시작", description: "예약한 시간에 1:1 수업을 시작합니다" },
  ],
};
