import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

export const MatterCard = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Matter.Engine.create());
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = engineRef.current;
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: '#001707',
        pixelRatio: window.devicePixelRatio
      }
    });

    // Create ground
    const ground = Matter.Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight - 60,
      window.innerWidth,
      20,
      { 
        isStatic: true,
        render: {
          fillStyle: '#001707',
          visible: false
        }
      }
    );

    // Add walls to keep card in view
    const wallOptions = {
      isStatic: true,
      render: { visible: false }
    };

    const leftWall = Matter.Bodies.rectangle(0, window.innerHeight / 2, 60, window.innerHeight, wallOptions);
    const rightWall = Matter.Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 60, window.innerHeight, wallOptions);

    Matter.World.add(engine.world, [ground, leftWall, rightWall]);
    Matter.Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      render.canvas.remove();
      Matter.Engine.clear(engine);
    };
  }, []);

  const dropCard = () => {
    if (!engineRef.current) return;

    // Remove any existing cards
    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    bodies.forEach(body => {
      if (!body.isStatic) {
        Matter.World.remove(engineRef.current.world, body);
      }
    });

    // Create card with rounded corners using chamfer
    const card = Matter.Bodies.rectangle(
      window.innerWidth / 2,
      100,
      176,  // Width
      222,  // Height
      {
        chamfer: { radius: 16 },  // Rounded corners
        render: {
          fillStyle: '#00B843',
          strokeStyle: '#00D64F',
          lineWidth: 2
        },
        angle: Math.PI / 6,  // Initial rotation
        restitution: 0.98,   // Match Three.js bounciness
        friction: 0.02,      // Match Three.js friction
        density: 0.001       // Lighter weight for better physics
      }
    );

    Matter.World.add(engineRef.current.world, card);
    setIsAnimating(true);
  };

  return (
    <div className="w-screen h-screen">
      <div className="fixed top-4 left-4 flex gap-4 z-50">
        <button
          className="px-6 py-3 rounded-full text-white transition-colors bg-[#00D64F] hover:bg-[#00C048]"
          onClick={() => {
            setIsAnimating(!isAnimating);
            dropCard();
          }}
        >
          {isAnimating ? 'Reset' : 'Drop'}
        </button>
      </div>
      <div ref={sceneRef} />
    </div>
  );
}; 