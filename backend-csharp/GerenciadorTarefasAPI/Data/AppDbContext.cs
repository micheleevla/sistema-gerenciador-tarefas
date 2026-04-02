using GerenciadorTarefasAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorTarefasAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Tarefa> Tarefas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Tarefa>()
                .HasOne(t => t.UsuarioCriador)
                .WithMany()
                .HasForeignKey(t => t.CriadoPor)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Tarefa>()
                .HasOne(t => t.UsuarioResponsavel)
                .WithMany()
                .HasForeignKey(t => t.AtribuidoPara)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}