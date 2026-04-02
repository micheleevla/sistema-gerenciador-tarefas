using GerenciadorTarefasAPI.Data;
using GerenciadorTarefasAPI.DTOs;
using GerenciadorTarefasAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorTarefasAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Username == dto.Username);

            if (usuario == null)
                return Unauthorized(new { mensagem = "Usuário não encontrado" });

            if (usuario.Senha != dto.Senha)
                return Unauthorized(new { mensagem = "Senha incorreta" });

            if (!usuario.Ativo)
                return Unauthorized(new { mensagem = "Usuário inativo" });

            return Ok(new
            {
                usuario.Id,
                usuario.Nome,
                usuario.Username,
                usuario.Tipo
            });
        }

        [HttpGet]
        public async Task<IActionResult> ListarUsuarios()
        {
            var usuarios = await _context.Usuarios.ToListAsync();
            return Ok(usuarios);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> BuscarUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
                return NotFound(new { mensagem = "Usuário não encontrado" });

            return Ok(usuario);
        }

        [HttpPost]
        public async Task<IActionResult> CriarUsuario(UsuarioCreateDto dto)
        {
            var usernameExiste = await _context.Usuarios.AnyAsync(u => u.Username == dto.Username);
            if (usernameExiste)
                return BadRequest(new { mensagem = "Username já existe" });

            if (!string.IsNullOrEmpty(dto.Email))
            {
                var emailExiste = await _context.Usuarios.AnyAsync(u => u.Email == dto.Email);
                if (emailExiste)
                    return BadRequest(new { mensagem = "Email já existe" });
            }

            var usuario = new Usuario
            {
                Nome = dto.Nome,
                Username = dto.Username,
                Email = dto.Email,
                Senha = dto.Senha,
                Tipo = dto.Tipo
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(usuario);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarUsuario(int id, UsuarioCreateDto dto)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
                return NotFound(new { mensagem = "Usuário não encontrado" });

            var usernameExiste = await _context.Usuarios
                .AnyAsync(u => u.Username == dto.Username && u.Id != id);

            if (usernameExiste)
                return BadRequest(new { mensagem = "Username já existe" });

            if (!string.IsNullOrEmpty(dto.Email))
            {
                var emailExiste = await _context.Usuarios
                    .AnyAsync(u => u.Email == dto.Email && u.Id != id);

                if (emailExiste)
                    return BadRequest(new { mensagem = "Email já existe" });
            }

            usuario.Nome = dto.Nome;
            usuario.Username = dto.Username;
            usuario.Email = dto.Email;
            usuario.Senha = dto.Senha;
            usuario.Tipo = dto.Tipo;

            await _context.SaveChangesAsync();

            return Ok(usuario);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> ExcluirUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
                return NotFound(new { mensagem = "Usuário não encontrado" });

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Usuário excluído com sucesso" });
        }

        [HttpPut("{id}/alterar-senha")]
        public async Task<IActionResult> AlterarSenha(int id, AlterarSenhaDto dto)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
                return NotFound(new { mensagem = "Usuário não encontrado" });

            if (usuario.Senha != dto.SenhaAtual)
                return BadRequest(new { mensagem = "Senha atual incorreta" });

            usuario.Senha = dto.NovaSenha;
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Senha alterada com sucesso" });
        }

        [HttpGet("teste-banco")]
        public IActionResult TesteBanco()
        {
            var connectionString = _context.Database.GetDbConnection().ConnectionString;
            return Ok(new { connectionString });
        }
    }
}