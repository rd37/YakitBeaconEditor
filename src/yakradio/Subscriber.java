package yakradio;

import java.util.LinkedList;

public class Subscriber {
	private LinkedList<Message> inboxmsgs = new LinkedList<Message>();
	private LinkedList<Message> readmsgs = new LinkedList<Message>();
	
	private int sessionkey;

	public Subscriber(int sessionkey){
		this.sessionkey = sessionkey;
	}
	
	public void addNewMessage(Message message){
		inboxmsgs.add(message);
	}
	
	public Message getNewNextMessage(){
		Message m = inboxmsgs.removeLast();
		readmsgs.add(m);
		return m;
	}
	
	public void clearReadMessages(){
		readmsgs.clear();
	}
	
	public void clearInBoxMessages(){
		inboxmsgs.clear();
	}
	
	public void clearAllMessage(){
		this.clearInBoxMessages();
		this.clearReadMessages();
	}
	
	public void setSessionkey(int sessionkey) {
		this.sessionkey = sessionkey;
	}

	public int getSessionkey() {
		return sessionkey;
	}
	
}
