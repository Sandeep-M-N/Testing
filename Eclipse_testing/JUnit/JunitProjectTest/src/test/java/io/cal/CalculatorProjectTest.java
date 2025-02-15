package io.cal;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.OS;

class CalculatorProjectTest {

	//@Test
	
	
	void addtest() {
		
		CalculatorProject c = new CalculatorProject();
		int expected = 2;
		int actual = c.add(1,1);
		
		assertEquals(expected,actual,"Add function calculate two inrtegers");
		
		
		
		
	}
	//@Test
	void subtest() {
		CalculatorProject c = new CalculatorProject();
		int expected = 5;
		int actual = c.sub(5,10);
		
		assertEquals(expected,actual,"sub function Subtract two inrtegers");
		
	}
	//@Test
	void multest() {
		CalculatorProject c = new CalculatorProject();
		int expected = 64;
		int actual = c.mul(8,8);
		
		assertEquals(expected,actual,"Mul function multiply two inrtegers");
	}
	//@Test
	void divtest() {
		CalculatorProject c = new CalculatorProject();
		int expected = 8;
		int actual = c.div(64,8);
		
		assertEquals(expected,actual,"div function divide two inrtegers");
		
	}
	//@Test
	void areaofcircle() {
		CalculatorProject c = new CalculatorProject();
		 assertEquals(314.1592653589793, c.areaofcircle(10));
	}
	//@Test
	void positive1() {
		CalculatorProject c = new CalculatorProject();
		boolean expected = true;
		boolean result1 = c.postive(2);
//		boolean result2 = c.postive(-5);
		
		assertEquals(expected,result1,"return true");
//		assertEquals(expected,result2,"return false");
	}
	@Test
	void positive2() {
		CalculatorProject c = new CalculatorProject();
		boolean expected = true;
		boolean result2 = c.postive(-5);
		assertEquals(expected,result2,"return false");
	}

}
