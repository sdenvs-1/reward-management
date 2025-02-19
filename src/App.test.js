import { render, screen, mount } from '@testing-library/react';
import App from './App';

let wrapper 

it('Test App mount', ()=>{
  render(<App />);
  console.log(render(<App />))
  // expect(screen.getByText('Learn React')).toBeInTheDocument();
})

it('sums numbers', () => {
  expect(1+2).toEqual(3);
  expect(2+2).toEqual(4);
});





