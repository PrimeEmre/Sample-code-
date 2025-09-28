using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Cryptography;
using UnityEngine;
using UnityEngine.UI;

public class BallController : MonoBehaviour
{
    // indetify UI elements,veriables, and Rigidbody
    public Text time, lives, result;
    private Rigidbody rb;
    float timeCounter = 65;
    int livesCounter = 5;
    bool gameStart = true;
    bool gameOver = false;



    // Start is called before the first frame update
    void Start()
    {
        // Get the Rigidbody component for physics
        rb = GetComponent<Rigidbody>();

        // Set the initial text for the UI
        lives.text = " " + lives.ToString();
        time.text = " " + Mathf.Round(timeCounter).ToString();

        // Hide the game over UI at the start
        result.gameObject.SetActive(false);
    }

    // Update is called once per frame
    void Update()
    {
        // This block runs ONLY when the game is active.
        if (gameStart && !gameOver)
        {
            // Count down the timer.
            timeCounter -= Time.deltaTime;
            time.text = " " + Mathf.Round(timeCounter).ToString();

            // Check if the timer has run out.
            if (timeCounter <= 0f)
            {
                gameOver = true;
                result.text = "Game Over";
            }
        }

        // This block runs ONLY when the game is over.
        if (gameOver)
        {
            // Show the "Game Over" or "You Win" message and the restart button.
            result.gameObject.SetActive(true);
        }
    }

    void FixedUpdate()
    {
        // All physics code should be in FixedUpdate
        if (gameStart && !gameOver)
        {
            // Handle user input for ball movement
            float horizontal = Input.GetAxis("Horizontal");
            float vertical = Input.GetAxis("Vertical");
            Vector3 force = new Vector3(horizontal, 0, vertical);
            rb.AddForce(force * 5f);
        }
        else
        {
            // If the game is over or not started, stop the ball's movement
            rb.velocity = Vector3.zero;
            rb.angularVelocity = Vector3.zero;
        }
    }

    void OnCollisionEnter(Collision collision)
    {
        if (gameStart && !gameOver)
        {
            string objectName = collision.gameObject.name;

            // Check if we hit the finish line.
            if (objectName.Equals("Finish"))
            {
                gameOver = true;
                result.text = "You Win!";
            }
            // Check if we hit a wall.
            else if (!objectName.Equals("Ground"))
            {
                // Use 'livesCounter' (the number) to decrease the count.
                livesCounter -= 1;

                // Use 'lives' (the UI element) to update the display with the number.
                lives.text = " " + livesCounter.ToString();

                // Check if we ran out of lives by checking the number.
                if (livesCounter <= 0)
                {
                    gameOver = true;
                    result.text = "Game Over";
                }
            }
        }
    }
}