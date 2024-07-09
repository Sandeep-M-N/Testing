package rentalCar;

public class RegistrationPage {

	 public boolean Yourname(String firstname,String LastName) {
		
		 return ((firstname.length()>0)&&(LastName.length()>0));
	 }
	 
	 public String Email(String email) {
		 return (email);
	 }
	 
	 public boolean PhoneNumber(long phNumber) {
		 return (phNumber==10);
	 }
	 public boolean UserName(String username) {
		 return ((username.length()>0));
	 }
	 public boolean Password(String password) {
		 return ((password.length()>=6) && (password.contains("@")));
	 }
}
