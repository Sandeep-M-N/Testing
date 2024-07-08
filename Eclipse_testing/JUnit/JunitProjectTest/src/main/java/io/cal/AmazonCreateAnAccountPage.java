package io.cal;

public class AmazonCreateAnAccountPage {
	public String YourName(String firstname,String lastname) {
		return (firstname + " "+lastname);
	}
	
	public String MobNoanedEmailID(long expectedMobNo, String email) {
	
		return (expectedMobNo + "email");
	}
	
	public boolean CheckPassword(String pass) {
		return pass.length()== 6;
		
	}
	public boolean clickContinue(boolean name,boolean email,boolean password) {
		return true;
	}

}
