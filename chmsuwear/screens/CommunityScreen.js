import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Mock Conversations ───────────────────────────────────────────────────────
const INITIAL_CONVERSATIONS = [
  {
    id: 'admin',
    name: 'CHMSU Admin',
    role: 'admin',
    avatar: '🏫',
    avatarBg: '#064e3b',
    avatarText: '#a7f3d0',
    lastMessage: 'Your order #1042 has been confirmed!',
    time: '10:32 AM',
    unread: 2,
    messages: [
      { id: '1', text: 'Hello! Welcome to CHMSU Wear. How can we help you today?', mine: false, time: '10:00 AM' },
      { id: '2', text: 'Hi! I ordered a Varsity Jacket, can I check the status?', mine: true,  time: '10:15 AM' },
      { id: '3', text: 'Of course! Let me check that for you.', mine: false, time: '10:20 AM' },
      { id: '4', text: 'Your order #1042 has been confirmed! Expected pickup is tomorrow at the Campus Store.', mine: false, time: '10:32 AM' },
    ],
  },
  {
    id: 'seller_juan',
    name: 'Juan D.',
    role: 'seller',
    avatar: 'JD',
    avatarBg: '#1d4ed8',
    avatarText: '#bfdbfe',
    lastMessage: 'Yes, the calculator is still available!',
    time: 'Yesterday',
    unread: 1,
    messages: [
      { id: '1', text: 'Hi! Is the Scientific Calculator still available?', mine: true,  time: 'Yesterday 2:00 PM' },
      { id: '2', text: "Yes, the calculator is still available! It's in great condition.", mine: false, time: 'Yesterday 2:10 PM' },
      { id: '3', text: 'Can I see more photos?', mine: true,  time: 'Yesterday 2:12 PM' },
      { id: '4', text: "Sure! I'll send them shortly. Where do you want to meet?", mine: false, time: 'Yesterday 2:15 PM' },
    ],
  },
  {
    id: 'seller_maria',
    name: 'Maria G.',
    role: 'seller',
    avatar: 'MG',
    avatarBg: '#7c3aed',
    avatarText: '#ede9fe',
    lastMessage: 'I can give you a discount if you buy 2!',
    time: 'Mon',
    unread: 0,
    messages: [
      { id: '1', text: 'Hello, are you selling the tote bags?', mine: true,  time: 'Mon 9:00 AM' },
      { id: '2', text: 'Yes! Canvas tote bags, ₱250 each.', mine: false, time: 'Mon 9:05 AM' },
      { id: '3', text: 'Can I get a discount if I buy 2?', mine: true,  time: 'Mon 9:10 AM' },
      { id: '4', text: 'I can give you a discount if you buy 2! ₱450 for both 😊', mine: false, time: 'Mon 9:15 AM' },
    ],
  },
];

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ convo, size = 48 }) => (
  <View style={[
    msgStyles.avatar,
    { width: size, height: size, borderRadius: size / 2, backgroundColor: convo.avatarBg },
  ]}>
    <Text style={{ color: convo.avatarText, fontSize: convo.role === 'admin' ? size * 0.42 : size * 0.33, fontWeight: '800' }}>
      {convo.avatar}
    </Text>
  </View>
);

// ─── Conversation Row ─────────────────────────────────────────────────────────
const ConvoRow = ({ convo, onPress }) => (
  <TouchableOpacity style={msgStyles.convoRow} onPress={onPress} activeOpacity={0.75}>
    <View style={{ position: 'relative' }}>
      <Avatar convo={convo} />
      {convo.role === 'admin' && <View style={msgStyles.onlineDot} />}
    </View>
    <View style={{ flex: 1 }}>
      <View style={msgStyles.convoTopRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={msgStyles.convoName}>{convo.name}</Text>
          {convo.role === 'admin'
            ? <View style={msgStyles.adminBadge}><Text style={msgStyles.adminBadgeText}>ADMIN</Text></View>
            : <View style={msgStyles.sellerBadge}><Text style={msgStyles.sellerBadgeText}>SELLER</Text></View>
          }
        </View>
        <Text style={msgStyles.convoTime}>{convo.time}</Text>
      </View>
      <View style={msgStyles.convoBottomRow}>
        <Text style={msgStyles.convoLastMsg} numberOfLines={1}>{convo.lastMessage}</Text>
        {convo.unread > 0 && (
          <View style={msgStyles.unreadBadge}>
            <Text style={msgStyles.unreadText}>{convo.unread}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

// ─── Chat Bubble ──────────────────────────────────────────────────────────────
const ChatBubble = ({ msg }) => (
  <View style={[msgStyles.bubbleWrapper, msg.mine ? msgStyles.bubbleMineWrapper : msgStyles.bubbleOtherWrapper]}>
    <View style={[msgStyles.bubble, msg.mine ? msgStyles.bubbleMine : msgStyles.bubbleOther]}>
      <Text style={[msgStyles.bubbleText, msg.mine && msgStyles.bubbleTextMine]}>{msg.text}</Text>
    </View>
    <Text style={msgStyles.bubbleTime}>{msg.time}</Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const CommunityScreen = () => {
  const insets = useSafeAreaInsets();
  const [view, setView]                   = useState('announcements');
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConvo, setActiveConvo]     = useState(null);
  const [input, setInput]                 = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (view === 'chat') {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 120);
    }
  }, [view, activeConvo?.messages]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  const openConvo = (convo) => {
    setConversations((prev) =>
      prev.map((c) => c.id === convo.id ? { ...c, unread: 0 } : c)
    );
    setActiveConvo(conversations.find((c) => c.id === convo.id));
    setView('chat');
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !activeConvo) return;
    const newMsg = {
      id: Date.now().toString(),
      text: trimmed,
      mine: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvo.id
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: trimmed, time: 'Just now' }
          : c
      )
    );
    setActiveConvo((prev) => prev ? { ...prev, messages: [...prev.messages, newMsg] } : prev);
    setInput('');
  };

  const AnnouncementCard = ({ title, text, meta, pinned, officialColor }) => (
    <View style={[styles.announcementCard, pinned && styles.pinnedCard]}>
      <View style={[styles.tag, { backgroundColor: officialColor || '#dcfce7' }]}>
        <Text style={[styles.tagText, { color: officialColor ? '#0369a1' : '#166534' }]}>
          {pinned ? '📌 ADMIN POST' : 'UPCOMING EVENT'}
        </Text>
      </View>
      <Text style={styles.announcementTitle}>{title}</Text>
      <Text style={styles.announcementBody}>{text}</Text>
      <Text style={styles.metaInfo}>{meta}</Text>
    </View>
  );

  // ── Top Bar ─────────────────────────────────────────────────────────────────
  const renderTopBar = () => {
    if (view === 'announcements') {
      return (
        <View style={styles.topBar}>
          {/* Title takes all available space, pushes button to far right */}
          <Text style={styles.sectionHeader}>Announcements</Text>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={styles.chatBtn}
            onPress={() => setView('inbox')}
            activeOpacity={0.7}
          >
            <Text style={styles.chatBtnText}>💬 Messages</Text>
            {totalUnread > 0 && (
              <View style={styles.chatBtnBadge}>
                <Text style={styles.chatBtnBadgeText}>{totalUnread}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    if (view === 'inbox') {
      return (
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setView('announcements')}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.sectionHeader}>Messages</Text>
          {totalUnread > 0 && (
            <Text style={styles.inboxSub}>  · {totalUnread} unread</Text>
          )}
        </View>
      );
    }

    if (view === 'chat' && activeConvo) {
      return (
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setView('inbox')}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Avatar convo={activeConvo} size={36} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.chatHeaderName}>{activeConvo.name}</Text>
            <Text style={styles.chatHeaderRole}>
              {activeConvo.role === 'admin' ? '🟢 CHMSU Official Store' : '🛍️ Student Seller'}
            </Text>
          </View>
        </View>
      );
    }
  };

  // ── Views ───────────────────────────────────────────────────────────────────
  const renderAnnouncements = () => (
    <ScrollView
      contentContainerStyle={[styles.mainScroll, { paddingBottom: insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
    >
      <AnnouncementCard
        pinned
        title="CHMSU Wear Launch Event"
        text="Welcome to the official launch of the CHMSU Wear marketplace! Students are encouraged to list their pre-loved items."
        meta="Posted 2 hours ago • CHMSU Admin"
      />
      <AnnouncementCard
        officialColor="#e0f2fe"
        title="Alijis Intramurals Merch"
        text="The Engineering Council will start taking pre-orders for the Intramurals jerseys next Monday."
        meta="Posted Today, 10:45 AM • ESC Council"
      />
    </ScrollView>
  );

  const renderInbox = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
    >
      <Text style={msgStyles.sectionLabel}>Official Store</Text>
      {conversations.filter((c) => c.role === 'admin').map((c) => (
        <ConvoRow key={c.id} convo={c} onPress={() => openConvo(c)} />
      ))}
      <Text style={[msgStyles.sectionLabel, { marginTop: 8 }]}>Student Sellers</Text>
      {conversations.filter((c) => c.role === 'seller').map((c) => (
        <ConvoRow key={c.id} convo={c} onPress={() => openConvo(c)} />
      ))}
    </ScrollView>
  );

  const renderChat = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={insets.top + 60}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={msgStyles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        <View style={msgStyles.dateDivider}>
          <View style={msgStyles.dateLine} />
          <Text style={msgStyles.dateText}>Conversation</Text>
          <View style={msgStyles.dateLine} />
        </View>
        {activeConvo?.messages.map((msg) => (
          <ChatBubble key={msg.id} msg={msg} />
        ))}
      </ScrollView>
      <View style={[msgStyles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={msgStyles.textInput}
          placeholder={`Message ${activeConvo?.name}...`}
          placeholderTextColor="#94a3b8"
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[msgStyles.sendBtn, !input.trim() && msgStyles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!input.trim()}
          activeOpacity={0.8}
        >
          <Text style={msgStyles.sendBtnText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  const bgColor = view === 'announcements' ? '#f0fdf4' : view === 'chat' ? '#f8fafc' : '#ffffff';

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={bgColor} />
      {renderTopBar()}
      <View style={{ flex: 1, backgroundColor: bgColor }}>
        {view === 'announcements' && renderAnnouncements()}
        {view === 'inbox'         && renderInbox()}
        {view === 'chat'          && renderChat()}
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },

  sectionHeader:  { fontSize: 22, fontWeight: '800', color: '#064e3b' },
  inboxSub:       { fontSize: 13, color: '#16a34a', fontWeight: '600' },
  chatHeaderName: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  chatHeaderRole: { fontSize: 11, color: '#64748b', fontWeight: '600', marginTop: 1 },

  backBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  backBtnText: { fontSize: 26, color: '#475569', lineHeight: 30, fontWeight: '300' },

  // Button pinned to the right via the spacer <View style={{ flex: 1 }} />
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    gap: 6,
  },
  chatBtnText:      { color: 'white', fontWeight: '700', fontSize: 13 },
  chatBtnBadge:     { backgroundColor: '#ef4444', minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  chatBtnBadgeText: { color: 'white', fontSize: 10, fontWeight: '800' },

  mainScroll:        { padding: 20 },
  announcementCard:  { backgroundColor: 'white', padding: 20, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  pinnedCard:        { borderLeftWidth: 5, borderLeftColor: '#16a34a' },
  tag:               { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50, marginBottom: 10 },
  tagText:           { fontSize: 10, fontWeight: '800' },
  announcementTitle: { fontSize: 18, fontWeight: '700', color: '#064e3b', marginBottom: 8 },
  announcementBody:  { fontSize: 14, color: '#475569', lineHeight: 20 },
  metaInfo:          { fontSize: 12, color: '#94a3b8', marginTop: 12 },
});

const msgStyles = StyleSheet.create({
  sectionLabel: {
    fontSize: 11, fontWeight: '800', color: '#94a3b8',
    letterSpacing: 0.8, textTransform: 'uppercase',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8,
  },
  convoRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14, gap: 14,
    borderBottomWidth: 0.5, borderBottomColor: '#f1f5f9',
  },
  avatar:    { alignItems: 'center', justifyContent: 'center' },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 13, height: 13, borderRadius: 7, backgroundColor: '#22c55e', borderWidth: 2, borderColor: 'white' },

  convoTopRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  convoName:      { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  convoTime:      { fontSize: 11, color: '#94a3b8', fontWeight: '500' },
  convoBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  convoLastMsg:   { fontSize: 13, color: '#64748b', flex: 1, marginRight: 8 },

  adminBadge:      { backgroundColor: '#dcfce7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  adminBadgeText:  { fontSize: 9, fontWeight: '800', color: '#15803d' },
  sellerBadge:     { backgroundColor: '#ede9fe', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  sellerBadgeText: { fontSize: 9, fontWeight: '800', color: '#6d28d9' },

  unreadBadge: { backgroundColor: '#16a34a', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  unreadText:  { color: 'white', fontSize: 11, fontWeight: '800' },

  messagesContent: { paddingHorizontal: 16, paddingVertical: 20 },
  dateDivider:     { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
  dateLine:        { flex: 1, height: 0.5, backgroundColor: '#e2e8f0' },
  dateText:        { fontSize: 11, color: '#94a3b8', fontWeight: '600' },

  bubbleWrapper:      { marginBottom: 12, maxWidth: '80%' },
  bubbleMineWrapper:  { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubbleOtherWrapper: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble:         { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleMine:     { backgroundColor: '#16a34a', borderBottomRightRadius: 4 },
  bubbleOther:    { backgroundColor: '#f1f5f9', borderBottomLeftRadius: 4 },
  bubbleText:     { fontSize: 14, color: '#1e293b', lineHeight: 20 },
  bubbleTextMine: { color: 'white' },
  bubbleTime:     { fontSize: 10, color: '#94a3b8', marginTop: 4, fontWeight: '500' },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 16, paddingTop: 10,
    borderTopWidth: 0.5, borderTopColor: '#e2e8f0',
    backgroundColor: 'white', gap: 10,
  },
  textInput: {
    flex: 1, backgroundColor: '#f1f5f9', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, color: '#0f172a', maxHeight: 100,
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  sendBtn:         { width: 42, height: 42, borderRadius: 21, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  sendBtnDisabled: { backgroundColor: '#d1fae5' },
  sendBtnText:     { color: 'white', fontSize: 20, fontWeight: '700', lineHeight: 24 },
});

export default CommunityScreen;