package yakradio;

import org.json.JSONArray;
import org.json.JSONObject;

public class JSONFactory {
	
	public JSONObject createReturnResult(boolean success,String message)throws Exception{
		JSONObject ret = new JSONObject();
		ret.put("msgtype", "ReturnResult");
		ret.put("success",success);
		ret.put("message",message);
		return ret;
	}

	public JSONObject createPublisherLoginReturn(String username, String password,
			int key) throws Exception{
		JSONObject pubRet = new JSONObject();
		pubRet.put("username", username);pubRet.put("password", password);
		pubRet.put("key",key);pubRet.put("msgtype", "LoginReturn");
		return pubRet;
	}
	
	public JSONObject createListBeaconReturn(Object[] beaconkeys)throws Exception{
		JSONObject ret = new JSONObject();
		JSONArray array = new JSONArray(beaconkeys);
		ret.put("msgtype", "ListBeaconsReturn");
		ret.put("beaconkeys", array);
		return ret;
	}

	public JSONObject createBeaconInfoReturn(Beacon beacon) throws Exception{
		JSONObject beaconInfo = new JSONObject();
		beaconInfo.put("msgtype", "BeaconInfoReturn");
		beaconInfo.put("beacon_name", beacon.getBeaconName());
		beaconInfo.put("beacon_latitude", beacon.getDot().lat);
		beaconInfo.put("beacon_longitude", beacon.getDot().lng);
		beaconInfo.put("beacon_range",beacon.getRange());
		beaconInfo.put("beacon_key", beacon.getBeaconKey());
		beaconInfo.put("beacon_activated", beacon.isRunning());
		beaconInfo.put("beacon_messages", new JSONArray(beacon.getMessageList()) );
		return beaconInfo;
	}

	public JSONObject createAddBeaconReturn(Beacon beacon) throws Exception{
		JSONObject retObj = new JSONObject();
		retObj.put("msgtype", "UpdateBeaconReturn");
		retObj.put("beacon_key", beacon.getBeaconKey());
		retObj.put("publisher_key", beacon.getPublisherKey());
		return retObj;
	}
}
