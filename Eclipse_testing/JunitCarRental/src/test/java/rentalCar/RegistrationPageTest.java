package rentalCar;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Scanner;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInfo;
import org.junit.jupiter.api.TestReporter;

import io.cal.CreateAnAccountPage;



class RegistrationPageTest {
 Scanner sc=new Scanner(System.in);
	RegistrationPage  rp=new RegistrationPage ();
	@Test
	void TestYourName() {
	
		System.out.println("Enter Your First Name:");
		String Firstname=sc.next();
		char[] ch=Firstname.toCharArray();
		for(int i=0;i<ch.length;i++) {
			if((ch[i]>='A')&& (ch[i]<='Z')||(ch[i]>='a')&& (ch[i]<='z')) {
				assertTrue(true);
			}else {
				System.out.println("Wrong Cretentials!!");
				assertTrue(false);
				break;
			}
		}
		
		System.out.println("Enter Your Last Name");
		String Lastname=sc.next();
		char[] ch1=Lastname.toCharArray();
		for(int i=0;i<ch1.length;i++) {
			if((ch1[i]>='A')&& (ch1[i]<='Z')||(ch1[i]>='a')&& (ch1[i]<='z')) {
				assertTrue(true);
			}else {
				System.out.println("Wrong Cretentials!!");
				assertTrue(false);
				break;
			}
		}

	}
	
	
	
	@Test
	void TestEmail() {
		assertAll(
				"",
				//()->assertEquals(rp.Email("Sivagmail.com"),rp.Email("Siva@gmail.com"))
				()->assertEquals(rp.Email("Siva@gmail.com"),rp.Email("Siva@gmail.com"))
				//()->assertEquals(rp.Email("Siva@gmailcom"),rp.Email("Siva@gmail.com"))
				);
	}
	

	@Test
	void TestPhoneNumber1() {
		System.out.println("Enter Phone Number:");
		//long actual=1234682222l;
		long number=sc.nextLong();
		if(!(number>'A'&& number<'Z')||!(number>'a'&& number<'z')) {
			assertTrue(true);
		}
	}
	@Test
	void TestUserName() {
		boolean actual=rp.UserName("Siva123");
		boolean expected=true;
		assertEquals(actual,expected);
	}
	@Test
	void TestUserPassword() {
		boolean actual=rp.Password("Siva@14");
		boolean expected=true;
		assertEquals(actual,expected);
	}
	
	TestInfo testinfo;
	TestReporter testReporter;
	@Test
	@Tag("TestYourName")
	@Tag("TestEmail")
	@Tag("TestPhoneNumber1")
	@Tag("TestUserName")
	@Tag("TestUserPassword")
	void init(TestInfo testinfo,TestReporter testReporter) {
		 rp=new RegistrationPage ();
		this.testinfo=testinfo;
		this.testReporter=testReporter;
		
		testReporter.publishEntry("Tested all CarRental RegistrationPage Feilds Successfully"+testinfo.getTags());
	}
}
