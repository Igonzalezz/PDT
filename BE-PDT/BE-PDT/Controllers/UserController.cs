using BE_PDT.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BE_PDT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }
        // GET: api/<UserController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> Get()
        {
            try
            {
                var listUsers = await _context.User.ToListAsync();
                return Ok(listUsers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/<UserController>/SingleUser
        [HttpPost("SingleUser")]
        public async Task<IActionResult> Post([FromBody] User user)
        {
            try
            {
                user.FechaReg = DateTime.Now.ToString("d");
                _context.Add(user);
                await _context.SaveChangesAsync();
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/<UserController>/MultiUser
        [HttpPost("MultiUser")]
        public async Task<IActionResult> PostList([FromBody] IEnumerable<User> userList)
        {
            try
            {
                foreach (var user in userList)
                {
                    user.FechaReg = DateTime.Now.ToString("d");
                    _context.Add(user);
                }
                await _context.SaveChangesAsync();
                return Ok(userList);
            }
            catch (Exception ex)
            {
                //this code is to handle the error for fields that have more data than the allowed in the database.
                Array error = ex.InnerException.Message.Contains("truncated") ? ex.InnerException.Message.Split("'") : null;

                if (error.Length == 7) 
                {
                    return Conflict(error.GetValue(3) + ": " + error.GetValue(5));
                }

                return BadRequest(ex.Message);
            }
        }

        // put api/<UserController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] User user)
        {
            try
            {
                if(id != user.Id)
                {
                    return NotFound();
                }
                user.FechaReg = _context.User.AsNoTracking().FirstOrDefault(x => x.Id == user.Id).FechaReg;

                _context.Update(user);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var user = await _context.User.FindAsync(id);

                if(user == null)
                {
                    return NotFound();
                }

                _context.User.Remove(user);
                await _context.SaveChangesAsync();
                return Ok();

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
