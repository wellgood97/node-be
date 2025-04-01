import React, { useEffect, useRef, useState } from 'react';

const ChatApp = () => {
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState(['user1', 'user2']); // 💡 테스트용 유저 목록
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const chatBoxRef = useRef(null);

  useEffect(() => {
    // ✅ 소켓 연결
    const ws = new WebSocket('ws://localhost:4000');
    setSocket(ws);

    ws.onopen = () => {
      console.log('🔌 WebSocket 연결됨');
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onclose = () => {
      console.log('❌ WebSocket 연결 종료');
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    // ✅ 메시지 수신 시 자동 스크롤
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputMsg.trim() !== '' && socket) {
      socket.send(inputMsg);
      setInputMsg('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div style={styles.container}>
      {/* 좌측 유저 목록 */}
      <div style={styles.userList}>
        <h3>🧑 유저 목록</h3>
        <ul className={styles.userList}>
          {users.map((user, idx) => (
            <li key={idx} style={styles.userItem}>{user}</li>
          ))}
        </ul>
      </div>

      {/* 우측 채팅 영역 */}
      <div style={styles.chatBox}>
        <div style={styles.messageArea} ref={chatBoxRef}>
          {messages.map((msg, i) => (
            <div key={i} style={styles.messageItem}>{msg}</div>
          ))}
        </div>

        {/* 입력창 */}
        <div style={styles.inputArea}>
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요"
            style={styles.input}
          />
          <button onClick={handleSend} style={styles.button}>전송</button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;

// ✅ 인라인 스타일
const styles = {
  container: {
    display: 'flex',
    width: '100%',
    height: '100vh',
    fontFamily: 'sans-serif',
  },
  userList: {
    width: '200px',
    borderRight: '1px solid #ccc',
    padding: '10px',
    backgroundColor: '#f9f9f9',
  },
  userItem: {
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  chatBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  messageArea: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
    backgroundColor: '#f4f4f4',
  },
  messageItem: {
    marginBottom: '10px',
    padding: '8px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    maxWidth: '70%',
  },
  inputArea: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginRight: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#2d89ef',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
