import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import "./gamestyle.css"
import { useTimer } from './useTimer';

const Gamepage = () => {

  const email = useLocation().state.email;
  const { seconds, start, pause, running, stop } = useTimer();

  let gridval = new Array(4);
  for (let i = 0; i < 4; i++) {
    gridval[i] = new Array(4);
    for (let j = 0; j < 4; j++)
      gridval[i][j] = 4 * i + j + 1;
  }
  const [griddata, setgrid] = useState(gridval);
  const [isplaying, setplaying] = useState(0);
  const [sortbytime, setsortbytime] = useState(1);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [moves, setMoves] = useState(0);

  const checkwin = () => {
    let win = true;
    for (let i = 0; i < 16; i++) {
      let r = Math.floor(i / 4);
      let c = i % 4;
      if (griddata[r][c] != i + 1)
        win = false;
    }
    if (win == 1) {
      let cur_move=moves;
      let cur_time=seconds;
      updatescore(cur_move,cur_time);
      setMoves(0); // Reset moves count
      stop();
      setplaying(0);
      alert('You WON!');
    }
    return;
  }
  const updatescore = async (cur_move, cur_time) => {

    if(email.length==0)
     return;
    try {
      const response = await fetch('https://puzzlegamebackend.onrender.com/update-bestscores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          time: cur_time,
          moves: cur_move,
        }),
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        console.log('Best scores updated:', responseData);
        // You can perform any additional actions here if needed
      } else {
        console.log('Error updating best scores:', responseData.error);
        // Handle the error scenario
      }
    } catch (error) {
      console.error('An error occurred while updating best scores:', error);
      // Handle the error scenario
    }
  };
  const handlecellclick = (rowind, colind, val) => {

    if (!isplaying)
      return;
    let brr = [...griddata];
    if (rowind - 1 >= 0 && brr[rowind - 1][colind] === 16) {
      [brr[rowind - 1][colind], brr[rowind][colind]] = [brr[rowind][colind], brr[rowind - 1][colind]]
    }
    else if (colind - 1 >= 0 && brr[rowind][colind - 1] === 16) {
      [brr[rowind][colind - 1], brr[rowind][colind]] = [brr[rowind][colind], brr[rowind][colind - 1]]
    }
    else if (rowind + 1 < 4 && brr[rowind + 1][colind] === 16) {
      [brr[rowind + 1][colind], brr[rowind][colind]] = [brr[rowind][colind], brr[rowind + 1][colind]]
    }
    else if (colind + 1 < 4 && brr[rowind][colind + 1] === 16) {
      [brr[rowind][colind + 1], brr[rowind][colind]] = [brr[rowind][colind], brr[rowind][colind + 1]]
    }
    setgrid(brr);
    setMoves(moves + 1);
    checkwin();
    // alert('rowind: ' + rowind + ' colind: ' + colind + ' val: ' + val);
  }
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  const issolvable=(arr)=>{
    let pos;
    let inv=0;
    for(let i=0;i<16;i++)
    for(let j=i+1;j<16;j++)
     {
      if(arr[i]!=16 && arr[j]!=16 && arr[i]>arr[j])
      inv++;
    if(arr[i]==16)
       pos=4-Math.floor(i/4);
     }
     console.log(pos,inv);
     if((pos%2==1 && inv%2==0) || (pos%2==0 && inv%2==1))
     return true;

     else return false;
  }
  const newgame = () => {
    //console.log(issolvable([1,2,3,4,5,6,7,8,9,11,10,12,15,14,13,16]));
    //alert('your email is '+ email);
    let temparr = [...gridval]
    const flattenedArray = temparr.flat();
    //console.log(flattenedArray);
    shuffleArray(flattenedArray);
    //console.log();
    while(!issolvable(flattenedArray)){
    shuffleArray(flattenedArray);}
    console.log(issolvable(flattenedArray));
    const shuffledArray = [];
    for (let i = 0; i < 4; i++) {
      shuffledArray.push(flattenedArray.slice(i * 4, (i + 1) * 4));
    }
    setgrid(shuffledArray);
    setplaying(1);
    setMoves(0); // Reset moves count
    stop();
    start();

  }


  useEffect(() => {
    // Fetch leaderboard data when the component mounts and whenever sortbytime changes
    fetchLeaderboard();
  }, [sortbytime]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`https://puzzlegamebackend.onrender.com/bestscore`);
      const data = await response.json();
      if (sortbytime)
        setLeaderboardData(data.lowestTimeUsers);
      else
        setLeaderboardData(data.lowestMoveUsers);

      //console.log(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  const renderLeaderboard = () => {
    return (
      <ul className="entries">
        {leaderboardData
          .filter(user => (sortbytime ? user.score_time !== 100000 : user.score_move !== 100000))
          .map((user, index) => (
            <li key={index} className="entry">
              <span id='leadername'>{user.username}</span>
              <span>{sortbytime ? user.score_time : user.score_move} {sortbytime ? 'seconds' : 'moves'}</span>
            </li>
          ))}
      </ul>
    );
  }

  return (
    <div>

      <div className='total'>
        <div className='puzzle'>
          <div className='grid-container'>
            <div className="game-info">
              <p>Moves: {moves}</p>
              <p>Time: {seconds} seconds</p>
            </div>
            {griddata.map((row, rowind) => {
              return (
                <div className='rows'>
                  {row.map((col, colind) => {

                    return (
                      <div className='cell' onClick={() => handlecellclick(rowind, colind, col)}>

                        <p className='indices'>{isplaying ? (col === 16 ? '' : col) : ''}</p>
                      </div>
                    );

                  })}

                </div>
              );
            })}
          </div>
        </div>
        <div className='leader'>
          <h2>Leaderboard</h2>
          <div class="options">
            <button id="sortByTime" onClick={() => setsortbytime(1)}>Sort by Time</button>
            <button id="sortByMoves" onClick={() => setsortbytime(0)}>Sort by Moves</button>
          </div>
          {renderLeaderboard()}
        </div>
      </div>
      <button id='new-game' onClick={newgame}>New-Game</button>
    </div>
  )
}

export default Gamepage