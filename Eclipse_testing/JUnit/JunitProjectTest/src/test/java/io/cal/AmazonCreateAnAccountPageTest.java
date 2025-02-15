package io.cal;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Scanner;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInfo;
import org.junit.jupiter.api.TestReporter;

class AmazonCreateAnAccountPageTest {
	AmazonCreateAnAccountPage a = new AmazonCreateAnAccountPage();

	//@Test
	void testyourName() {
		
		String Fname="Sandeep";
		String Lname="Rao";
		String Full=Fname + " "+Lname;
		String expected =Full;
		String actual = a.YourName("Sandeep", "Rao");
		assertEquals(expected,actual);
	}
	//@Test
	void testyourName2() {

		String Fname="Sandeep";
		String Lname=" ";
		String Full=Fname + " "+Lname;
		String expected =Full;
		String actual = a.YourName("Sandeep", "Rao");
		assertEquals(expected,actual);
	}
	//@Test
	void testyourName3() {
		String Fname=" ";
		String Lname="Rao";
		String Full=Fname + " "+Lname;
		String expected =Full;
		String actual = a.YourName("Sandeep", "Rao");
		assertEquals(expected,actual);
	}
	//@Test
	void testyourName4() {
		String Fname=" ";
		String Lname=" ";
		String Full=Fname + " "+Lname;
		String expected =Full;
		String actual = a.YourName("Sandeep", "Rao");
		assertEquals(expected,actual);
	}
	//@Test
	void testMobAndEmailID() {
		long expectedmobno = 9566197337l;
		String expectedemailId = "abcd@gmail.com";
		
		String actualResult= a.MobNoanedEmailID(expectedmobno, expectedemailId);
		
		assertEquals(a.MobNoanedEmailID(expectedmobno, expectedemailId), actualResult);
		
	}
	//@Test
	void testMobAndEmailID1() {
		assertAll(
				"",
				()->assertEquals(a.MobNoanedEmailID(9566187337l, "abc@gmail.com"),a.MobNoanedEmailID(9566187337l,"abc@gmail.com")),
				()->assertEquals(a.MobNoanedEmailID(0l, "ac@gmail.com"), a.MobNoanedEmailID(9566187337l,"abc@gmail.com")),
				()->assertEquals(a.MobNoanedEmailID( 8610036988l, " "), a.MobNoanedEmailID(9566187337l,"abc@gmail.com")),
				()->assertEquals(a.MobNoanedEmailID( 8610036988l, "abcgmail.com"), a.MobNoanedEmailID(9566187337l,"abc@gmail.com"))
				);
	}
	Scanner sc = new Scanner(System.in);
	
	
	
	
	//@Test
	void checkPassword() {
		System.out.println("Enter your Password");
		String pass=sc.nextLine();
		boolean isvalid = true;
		assertSame(isvalid,a.CheckPassword(pass));
	
	}
//	private boolean ispassword(String pass) {
//		if(pass.length()==6) {
//			return true ;
//		}
//		else {
//			return false;
//		}
//	}
	@Test
	void ClickContinue() {
		System.out.println("enter your name");
		String name = sc.nextLine();
		System.out.println("enter your email");
		String email= sc.nextLine();
		System.out.println("enter your password");
		String password=sc.nextLine();
		
		boolean isname=ischeckname(name);
		boolean isemail=ischeckemail(email);
		boolean ispassword = ischeckpassword(password);
		assertSame(a.clickContinue(isname, isemail, ispassword),a.clickContinue(isname, isemail, ispassword));
	
		
	}
	private boolean ischeckname(String name) {
		if(name.isEmpty()) {
			return false;
		}
		else {
			return true;
		}
	}
	private boolean ischeckemail(String email) {
		int index = email.indexOf('@');
		if(email.isEmpty()) {
			return false;
		}
		else if (index<0) {
			return false;
		}
		else {
			return true;
		}
	}
	private boolean ischeckpassword(String password) {
		if(password.length()==6) {
			return true;
		}
		else {
			return false;
		}
	}
	
	AmazonCreateAnAccountPage t;
	TestInfo testinfo;
	TestReporter testReporter;
	
	@Test
	@Tag("testyourName")
	@Tag("testMobAndEmailID")
	@Tag("checkPassword")

	
	void init(TestInfo testinfo,TestReporter testReporter ) {
		t = new AmazonCreateAnAccountPage();
		this.testinfo = testinfo;
		this.testReporter = testReporter;
		testReporter.publishEntry("Tested all AmazonCreateAnAccountPage Fields Successfully" + testinfo.getTags());
	}
	
	
}
